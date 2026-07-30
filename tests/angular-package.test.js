const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "..");

async function loadAngularRuntime() {
  await import("@angular/compiler");

  const [
    { DOCUMENT },
    angularCore,
    { MatIconRegistry },
    { DomSanitizer },
    voteyAngular,
  ] = await Promise.all([
    import("@angular/common"),
    import("@angular/core"),
    import("@angular/material/icon"),
    import("@angular/platform-browser"),
    import("@pleodigital/design-system-votey/angular"),
  ]);

  return {
    DOCUMENT,
    DomSanitizer,
    MatIconRegistry,
    ...angularCore,
    ...voteyAngular,
  };
}

function createDocumentFixture(userAgent) {
  const attributes = new Map();
  const customProperties = new Map();
  const listeners = new Map();
  const browserWindow = {
    innerWidth: 1440,
    innerHeight: 900,
    navigator: {
      maxTouchPoints: 0,
      userAgent,
    },
    addEventListener(name, callback) {
      listeners.set(name, callback);
    },
    removeEventListener(name) {
      listeners.delete(name);
    },
  };
  const document = {
    body: {
      setAttribute(name, value) {
        attributes.set(name, value);
      },
    },
    defaultView: browserWindow,
    documentElement: {
      style: {
        setProperty(name, value) {
          customProperties.set(name, value);
        },
      },
    },
  };

  return { attributes, customProperties, document, listeners };
}

function countSvgFiles(entryPath) {
  return fs.readdirSync(entryPath, { withFileTypes: true }).reduce(
    (count, entry) => {
      const childPath = path.join(entryPath, entry.name);

      if (entry.isDirectory()) return count + countSvgFiles(childPath);
      return count + (path.extname(entry.name).toLowerCase() === ".svg" ? 1 : 0);
    },
    0,
  );
}

test("Angular subpath exports the device and SVG registry runtimes without changing deep imports", async () => {
  const {
    provideVoteyDeviceDetection,
    provideVoteySvgRegistry,
    VoteyIconNames,
    VoteyIllustrationNames,
    VOTEY_DEFAULT_GRID_CONFIG,
    VOTEY_GRID_CONFIG,
    VOTEY_SVG_REGISTRY_CONFIG,
    VoteyDeviceService,
    VoteySvgRegistryService,
  } = await loadAngularRuntime();

  assert.equal(typeof VoteyDeviceService, "function");
  assert.equal(typeof provideVoteyDeviceDetection, "function");
  assert.equal(typeof VoteySvgRegistryService, "function");
  assert.equal(typeof provideVoteySvgRegistry, "function");
  assert.equal(typeof VOTEY_GRID_CONFIG, "object");
  assert.equal(typeof VOTEY_SVG_REGISTRY_CONFIG, "object");
  assert.equal(
    VoteyIconNames.length,
    countSvgFiles(path.join(projectRoot, "assets", "icons")),
  );
  assert.equal(
    VoteyIllustrationNames.length,
    countSvgFiles(path.join(projectRoot, "assets", "illustrations")),
  );
  assert.ok(VoteyIconNames.includes("ui-agenda"));
  assert.ok(VoteyIllustrationNames.includes("spot-chat-on"));
  const gridTokens = JSON.parse(
    fs.readFileSync(
      path.join(projectRoot, "tokens", "grid", "angular.json"),
      "utf8",
    ),
  );
  assert.deepEqual(VOTEY_DEFAULT_GRID_CONFIG, {
    desktop: gridTokens.grid.admin.desktop.columns.value,
    tablet: gridTokens.grid.admin.tablet.columns.value,
    mobile: gridTokens.grid.admin.mobile.columns.value,
  });
  assert.equal(gridTokens.grid.mobile, undefined);
  assert.equal(gridTokens.grid.admin.mobile["reference-width"], undefined);
  assert.equal(gridTokens.breakpoint.mobile.value, 375);
  assert.equal(gridTokens.breakpoint.tablet.value, 1024);
  assert.equal(gridTokens.breakpoint.desktop.value, 1920);
  assert.match(
    require.resolve(
      "@pleodigital/design-system-votey/dist/css/tokens.angular.css",
    ),
    /dist[\\/]css[\\/]tokens\.angular\.css$/,
  );
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"),
  );
  assert.equal(
    packageJson.exports["./ds-device-mixins"].sass,
    "./dist/scss/_ds-device-mixins.scss",
  );
  assert.match(
    require.resolve("@pleodigital/design-system-votey/ds-device-mixins"),
    /dist[\\/]scss[\\/]_ds-device-mixins\.scss$/,
  );
});

test("device service initializes responsive document attributes and viewport unit", async () => {
  const {
    DOCUMENT,
    Injector,
    PLATFORM_ID,
    runInInjectionContext,
    VoteyDeviceService,
  } = await loadAngularRuntime();
  const fixture = createDocumentFixture(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
  );
  const injector = Injector.create({
    providers: [
      { provide: DOCUMENT, useValue: fixture.document },
      { provide: PLATFORM_ID, useValue: "browser" },
    ],
  });
  const service = runInInjectionContext(
    injector,
    () => new VoteyDeviceService(),
  );

  service.initialize();

  assert.equal(service.currentDevice, "desktop");
  assert.equal(service.columnsAmount, 12);
  assert.equal(service.deviceOrientation, "horizontal");
  assert.equal(fixture.attributes.get("data-device"), "desktop");
  assert.equal(fixture.attributes.get("data-orientation"), "horizontal");
  assert.equal(fixture.customProperties.get("--vh"), "9px");
  assert.equal(fixture.listeners.has("resize"), true);

  service.update(375, 812);
  assert.equal(service.deviceOrientation, "vertical");
  assert.equal(fixture.attributes.get("data-orientation"), "vertical");
  assert.equal(fixture.customProperties.get("--vh"), "8.12px");

  service.ngOnDestroy();
  assert.equal(fixture.listeners.has("resize"), false);
});

test("device service applies an injected grid configuration", async () => {
  const {
    DOCUMENT,
    Injector,
    PLATFORM_ID,
    runInInjectionContext,
    VOTEY_GRID_CONFIG,
    VoteyDeviceService,
  } = await loadAngularRuntime();
  const fixture = createDocumentFixture(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
  );
  const injector = Injector.create({
    providers: [
      { provide: DOCUMENT, useValue: fixture.document },
      { provide: PLATFORM_ID, useValue: "browser" },
      {
        provide: VOTEY_GRID_CONFIG,
        useValue: { desktop: 10, tablet: 6, mobile: 2 },
      },
    ],
  });
  const service = runInInjectionContext(
    injector,
    () => new VoteyDeviceService(),
  );
  const columns = [];
  const subscription = service.columnsAmount$.subscribe((value) =>
    columns.push(value),
  );

  service.initialize();

  assert.equal(service.columnsAmount, 10);
  assert.deepEqual(columns, [0, 10]);

  subscription.unsubscribe();
  service.ngOnDestroy();
});

test("SVG registry registers every public Votey asset exactly once", async () => {
  const {
    DomSanitizer,
    Injector,
    MatIconRegistry,
    runInInjectionContext,
    VoteyIconRegistryEntries,
    VoteyIllustrationRegistryEntries,
    VoteySvgRegistryService,
  } = await loadAngularRuntime();
  const registrations = [];
  const sanitizedUrls = [];
  const injector = Injector.create({
    providers: [
      {
        provide: MatIconRegistry,
        useValue: {
          addSvgIcon(name, url) {
            registrations.push({ name, url });
          },
        },
      },
      {
        provide: DomSanitizer,
        useValue: {
          bypassSecurityTrustResourceUrl(url) {
            sanitizedUrls.push(url);
            return url;
          },
        },
      },
    ],
  });
  const service = runInInjectionContext(
    injector,
    () => new VoteySvgRegistryService(),
  );

  service.register();
  service.register();

  const publicAssets = [
    ...VoteyIconRegistryEntries,
    ...VoteyIllustrationRegistryEntries,
  ];

  assert.equal(registrations.length, publicAssets.length);
  assert.equal(sanitizedUrls.length, publicAssets.length);
  assert.deepEqual(registrations[0], {
    name: publicAssets[0].name,
    url: `assets/votey/${publicAssets[0].path}`,
  });
  assert.ok(
    registrations.every(({ url }) => url.startsWith("assets/votey/")),
  );
});

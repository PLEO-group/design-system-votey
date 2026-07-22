const assert = require("node:assert/strict");
const test = require("node:test");

async function loadAngularRuntime() {
  await import("@angular/compiler");

  const [{ DOCUMENT }, angularCore, voteyAngular] = await Promise.all([
    import("@angular/common"),
    import("@angular/core"),
    import("@pleodigital/design-system-votey/angular"),
  ]);

  return { DOCUMENT, ...angularCore, ...voteyAngular };
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

test("Angular subpath exports the device runtime without changing deep imports", async () => {
  const { provideVoteyDeviceDetection, VoteyDeviceService } =
    await loadAngularRuntime();

  assert.equal(typeof VoteyDeviceService, "function");
  assert.equal(typeof provideVoteyDeviceDetection, "function");
  assert.match(
    require.resolve(
      "@pleodigital/design-system-votey/dist/css/tokens.angular.css",
    ),
    /dist[\\/]css[\\/]tokens\.angular\.css$/,
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

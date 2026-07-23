import * as i0 from '@angular/core';
import { EnvironmentProviders, OnDestroy, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

type VoteyDevice = "mobile" | "tablet" | "desktop";
type VoteyDeviceOrientation = "vertical" | "horizontal";
interface VoteyGridConfig {
    readonly desktop: number;
    readonly tablet: number;
    readonly mobile: number;
}
interface VoteyDeviceDimensions {
    width: number;
    height: number;
    mobileBreakpoint: 375;
    tabletBreakpoint: 1024;
    laptopBreakpoint: 1280;
    desktopBreakpoint: 1920;
}
declare const VOTEY_DEFAULT_GRID_CONFIG: Readonly<VoteyGridConfig>;
declare const VOTEY_GRID_CONFIG: InjectionToken<VoteyGridConfig>;
declare class VoteyDeviceService implements OnDestroy {
    private readonly document;
    private readonly gridConfig;
    private readonly platformId;
    private readonly deviceTypeSubject;
    private readonly dimensionsSubject;
    private readonly initializedSubject;
    private readonly columnsAmountSubject;
    private listeningForResize;
    readonly deviceType$: Observable<VoteyDevice | null>;
    readonly deviceDimensions$: Observable<VoteyDeviceDimensions>;
    readonly initialized$: Observable<boolean>;
    readonly columnsAmount$: Observable<number>;
    columnsAmount: number;
    currentDevice: VoteyDevice | null;
    deviceOrientation: VoteyDeviceOrientation;
    isMobileDevice: boolean;
    isTabletDevice: boolean;
    isDesktopDevice: boolean;
    private readonly handleResize;
    initialize(): void;
    update(innerWidth: number, innerHeight: number): void;
    ngOnDestroy(): void;
    private detectDevice;
    private applyDocumentState;
    static ɵfac: i0.ɵɵFactoryDeclaration<VoteyDeviceService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<VoteyDeviceService>;
}
declare function provideVoteyDeviceDetection(gridConfig?: VoteyGridConfig): EnvironmentProviders;

export { VOTEY_DEFAULT_GRID_CONFIG, VOTEY_GRID_CONFIG, VoteyDeviceService, provideVoteyDeviceDetection };
export type { VoteyDevice, VoteyDeviceDimensions, VoteyDeviceOrientation, VoteyGridConfig };

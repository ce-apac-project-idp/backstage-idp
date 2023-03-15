export namespace RhacsImage {
  export interface Name {
    registry: string;
    remote: string;
    tag: string;
    fullName: string;
  }

  export interface Layer {
    instruction: string;
    value: string;
    created: any;
    author: string;
    empty: boolean;
  }

  export interface V1 {
    digest: string;
    created: Date;
    author: string;
    layers: Layer[];
    user: string;
    command: any[];
    entrypoint: string[];
    volumes: any[];
  }

  export interface V2 {
    digest: string;
  }

  export interface Metadata {
    v1: V1;
    v2: V2;
    layerShas: string[];
    version: string;
  }

  export interface Component {
    name: string;
    version: string;
    license?: any;
    vulns: object[];
    layerIndex: number;
    priority: string;
    source: string;
    location: string;
    riskScore: number;
    fixedBy: string;
    executables: any[];
    topCvss?: number;
  }

  export interface DataSource {
    id: string;
    name: string;
  }

  export interface Scan {
    scannerVersion: string;
    scanTime: string;
    components: Component[];
    operatingSystem: string;
    dataSource: DataSource;
  }

  export interface RootObject {
    id: string;
    name: Name;
    metadata: Metadata;
    scan: Scan;
    components: number;
    cves: number;
    fixableCves: number;
    lastUpdated: string;
    notPullable: boolean;
    isClusterLocal: boolean;
    priority: string;
    riskScore: number;
    topCvss: number;
  }
}

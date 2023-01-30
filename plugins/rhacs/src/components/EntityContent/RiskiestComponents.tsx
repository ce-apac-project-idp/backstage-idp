import {
  Table,
  TableColumn,
  GaugeCard,
  StatusOK,
  SupportButton,
  TrendLine,
  Link,
} from '@backstage/core-components';
import {
  Paper,
  styled,
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  Chip,
} from '@material-ui/core';

interface RiskyComponent {
  id: string;
  name: string;
  version: string;
  lastScanned: string;
  vulnCounter: {
    all: {
      total: number;
      fixable: number;
    }
  };
  priority: number;
}

const riskyComponents = [
      {
        "id": "YWNs:Mi4yLjUzLTEuZWw4Lng4Nl82NA",
        "name": "acl",
        "version": "2.2.53-1.el8.x86_64",
        "lastScanned": "2023-01-19T10:41:44.490390732Z",
        "vulnCounter": {
          "all": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "low": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "moderate": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "important": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "critical": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "__typename": "VulnerabilityCounter"
        },
        "priority": 49,
        "__typename": "EmbeddedImageScanComponent"
      },
      {
        "id": "YXVkaXQtbGlicw:My4wLjctMi5lbDguMi54ODZfNjQ",
        "name": "audit-libs",
        "version": "3.0.7-2.el8.2.x86_64",
        "lastScanned": "2023-01-19T07:35:35.574857013Z",
        "vulnCounter": {
          "all": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "low": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "moderate": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "important": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "critical": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "__typename": "VulnerabilityCounter"
        },
        "priority": 49,
        "__typename": "EmbeddedImageScanComponent"
      },
      {
        "id": "YmFzZXN5c3RlbQ:MTEtNS5lbDgubm9hcmNo",
        "name": "basesystem",
        "version": "11-5.el8.noarch",
        "lastScanned": "2023-01-19T10:41:44.490390732Z",
        "vulnCounter": {
          "all": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "low": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "moderate": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "important": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "critical": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "__typename": "VulnerabilityCounter"
        },
        "priority": 49,
        "__typename": "EmbeddedImageScanComponent"
      },
      {
        "id": "YmFzaA:NC40LjIwLTMuZWw4Lng4Nl82NA",
        "name": "bash",
        "version": "4.4.20-3.el8.x86_64",
        "lastScanned": "2023-01-19T07:35:35.574857013Z",
        "vulnCounter": {
          "all": {
            "total": 1,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "low": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "moderate": {
            "total": 1,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "important": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "critical": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "__typename": "VulnerabilityCounter"
        },
        "priority": 41,
        "__typename": "EmbeddedImageScanComponent"
      },
      {
        "id": "YnJvdGxp:MS4wLjYtMy5lbDgueDg2XzY0",
        "name": "brotli",
        "version": "1.0.6-3.el8.x86_64",
        "lastScanned": "2023-01-19T10:41:44.490390732Z",
        "vulnCounter": {
          "all": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "low": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "moderate": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "important": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "critical": {
            "total": 0,
            "fixable": 0,
            "__typename": "VulnerabilityFixableCounterResolver"
          },
          "__typename": "VulnerabilityCounter"
        },
        "priority": 49,
        "__typename": "EmbeddedImageScanComponent"
      }
    ];

const generateTestData = (rows = 5) => {
  const data: Array<TableData> = [];
  while (data.length <= rows) {
    data.push({
      id: data.length + 18534,
      branch: 'techdocs: modify documentation header',
      hash: 'techdocs/docs-header 5749c98e3f61f8bb116e5cb87b0e4e1 ',
      status: 'Success',
    });
  }
  return data;
};

interface TableData {
  id: number;
  branch: string;
  hash: string;
  status: string;
}

const columns: TableColumn[] = [
  {
    title: 'Name',
    render: (row:RiskyComponent) => `${row.name}:${row.version}`,
    highlight: true,
    width: '80px',
  },
  // {
  //   title: 'Message/Source',
  //   highlight: true,
  //   render: (row: Partial<TableData>) => (
  //     <>
  //       <Link to="#message-source">{row.branch}</Link>
  //       <Typography variant="body2">{row.hash}</Typography>
  //     </>
  //   ),
  // },
  {
    title: 'Vulnerability Count',
    render: (row: RiskyComponent) => {
      const count = row.vulnCounter.all.total;
      if (count > 0) {
        return <Chip label={`${row.vulnCounter.all.total} CVE`} color="warning" />
      }
      return <Chip label="No CVE" color="info" />
    },
    width: '10%',
  },
];

export const RiskiestComponentsCard = () => {
  return (
    <Table
      options={{ padding: 'dense', paging: false, filtering: false }}
      data={ riskyComponents }
      columns={ columns }
      title="Top Riskiest Components"
    />
  )
}
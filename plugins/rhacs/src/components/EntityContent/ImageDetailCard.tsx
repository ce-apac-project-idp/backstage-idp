import {
  StructuredMetadataTable,
} from '@backstage/core-components';
import {
  Grid,
  Paper,
  styled,
  Card, CardContent, CardHeader
} from '@material-ui/core';

const metadata = {
  id: "sha256:fc25524ccb0ea78526257778ab54bfb1a25772b75fcc97df98eb06a0e67e1bf6",
  lastUpdated: "2023-01-19T11:35:42.85705591Z",
  deploymentCount: 13,
  vulnCount: 157,
  priority: 1,
}

const topVuln = {
  "cvss": 9.800000190734863,
  "scoreVersion": "V3",
}

const image = {
  "fullName": "registry.redhat.io/rhceph/rhceph-5-rhel8@sha256:fc25524ccb0ea78526257778ab54bfb1a25772b75fcc97df98eb06a0e67e1bf6",
  "registry": "registry.redhat.io",
  "remote": "rhceph/rhceph-5-rhel8",
  "tag": "",
}

const scanner = {
  "scanTime": "2023-01-19T11:35:38.826759847Z",
  "operatingSystem": "rhel:8",
  "dataSource": {
    "name": "Stackrox Scanner",
  }
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const ImageDetailCard = () => {
  return (
    <Card>
      <CardHeader title="Information" />
      <CardContent>

        <Grid container spacing={2}>
          <Grid item >
            <Item> Risk Priority: 1 </Item>
          </Grid>
          <Grid item >
            <Item> Top CVSS: 9.8 </Item>
          </Grid>
          <Grid item >
            <StructuredMetadataTable metadata={metadata} />
          </Grid>
        </Grid>

      </CardContent>
    </Card>
  );
};
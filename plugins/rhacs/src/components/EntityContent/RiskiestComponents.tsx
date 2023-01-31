import React, { useContext } from 'react';
import { Table, TableColumn } from '@backstage/core-components';
import { Chip, CircularProgress } from '@material-ui/core';

import { RhacsContext } from './EntityRhacsContent';
import { RhacsImage } from '../../helpers/types';

function getRiskyComponents(components: RhacsImage.Component[]) {
  return components.slice(0, 5);
}

const columns: TableColumn[] = [
  {
    title: 'Name',
    render: (row: RhacsImage.Component) => `${row.name}:${row.version}`,
    highlight: true,
    width: '80px',
  },
  {
    title: 'Vulnerability Count',
    render: (row: RhacsImage.Component) => {
      const count = row.vulns.length;
      if (count > 0) {
        return <Chip label={`${count} CVE`} color="warning" />;
      }
      return <Chip label="No CVE" color="info" />;
    },
    width: '10%',
  },
];

export const RiskiestComponentsCard = () => {
  const { image } = useContext(RhacsContext);

  if (!image || !image.id) {
    return <CircularProgress />;
  }

  return (
    <Table
      options={{
        padding: 'dense',
        paging: false,
        filtering: false,
        search: false,
      }}
      data={getRiskyComponents(image.scan.components)}
      columns={columns}
      title="Top Riskiest Components"
    />
  );
};

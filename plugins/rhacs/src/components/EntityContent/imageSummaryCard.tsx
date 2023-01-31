import React, { useContext } from 'react';
import { InfoCard } from '@backstage/core-components';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
} from '@material-ui/core';

import { RhacsContext } from './EntityRhacsContent';

export function ImageSummaryCard() {
  const context = useContext(RhacsContext);
  const image = context.image;

  if (!context.imageSha || !image || !image.id) {
    return <CircularProgress />;
  }

  return (
    <InfoCard title="Image Summary">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              {' '}
              <b> Reference </b>{' '}
            </TableCell>
            <TableCell> {context.imageReference} </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              {' '}
              <b> SHA </b>{' '}
            </TableCell>
            <TableCell> {context.imageSha} </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              {' '}
              <b> Last Updated </b>{' '}
            </TableCell>
            <TableCell> {image.lastUpdated} </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              {' '}
              <b> Scanner </b>{' '}
            </TableCell>
            <TableCell> {image.scan.dataSource.name} </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              {' '}
              <b> Scan Time </b>{' '}
            </TableCell>
            <TableCell> {image.scan.scanTime} </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InfoCard>
  );
}

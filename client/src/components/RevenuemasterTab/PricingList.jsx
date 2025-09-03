import React from 'react';
import { useGetAllPricingsServiceQuery } from '../../store/pricingFeature/pricingService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

const PricingList = () => {
  const { data: pricingList, isLoading } = useGetAllPricingsServiceQuery();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className='flex flex-col gap-6 mx-auto max-w-4xl'>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>List of Employee</h1>
        <p className='text-balance text-sm text-muted-foreground'>
          List of all employees in the company
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {Object.entries(pricingList.data.header).map(([key, label]) => (
              <TableHead key={key}>{label}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pricingList.data.pricingList.length > 0 &&
            pricingList.data.pricingList.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>{employee.city}</TableCell>
                <TableCell>{employee.pricePerView}</TableCell>
                <TableCell>{employee.pricePerLike}</TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PricingList;

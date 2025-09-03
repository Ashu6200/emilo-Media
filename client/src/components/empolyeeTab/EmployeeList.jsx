import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useGetAllEmployeesServiceQuery } from '../../store/mainFeatures/mainService';

const EmployeeList = () => {
  const { data: employeeList, isLoading } = useGetAllEmployeesServiceQuery();
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
            {Object.entries(employeeList.data.header).map(([key, label]) => (
              <TableHead key={key}>{label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {employeeList.data.empolyeeList.length > 0 &&
            employeeList.data.empolyeeList.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell className='font-medium'>
                  {employee.fullName}
                </TableCell>
                <TableCell>{employee.username}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.role}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeList;

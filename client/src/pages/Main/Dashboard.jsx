import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import CreateEmployee from '../../components/empolyeeTab/CreateEmployee';
import EmployeeList from '../../components/empolyeeTab/EmployeeList';
import CreatePricing from '../../components/RevenuemasterTab/CreatePricing';
import PricingList from '../../components/RevenuemasterTab/PricingList';
import PostList from '../../components/postListTab/PostList';
import AccountList from '../../components/accountTab/AccountList';

const Dashboard = () => {
  return (
    <section className='mx-auto grid h-full grid-cols-1 gap-4 px-4 py-4'>
      <Tabs defaultValue='empolyee' className='w-full'>
        <TabsList className='w-full border shadow-xs dark:bg-input/20 dark:border-input'>
          <TabsTrigger value='empolyee'>Empolyee</TabsTrigger>
          <TabsTrigger value='Revenuemaster'>Revenue Master</TabsTrigger>
          <TabsTrigger value='postList'>Post List</TabsTrigger>
          <TabsTrigger value='account'>Account</TabsTrigger>
        </TabsList>
        <TabsContent value='empolyee'>
          <Tabs defaultValue='createEmpolyee' className='w-full'>
            <TabsList className='w-full border shadow-xs dark:bg-input/20 dark:border-input'>
              <TabsTrigger value='createEmpolyee'>Create Empolyee</TabsTrigger>
              <TabsTrigger value='empolyeeList'>EmpolyeeList</TabsTrigger>
            </TabsList>
            <TabsContent value='createEmpolyee'>
              <CreateEmployee />
            </TabsContent>
            <TabsContent value='empolyeeList'>
              <EmployeeList />
            </TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent value='Revenuemaster'>
          <Tabs defaultValue='createPricing' className='w-full'>
            <TabsList className='w-full border shadow-xs dark:bg-input/20 dark:border-input'>
              <TabsTrigger value='createPricing'>Create Pricing</TabsTrigger>
              <TabsTrigger value='pricingList'>Pricing List</TabsTrigger>
            </TabsList>
            <TabsContent value='createPricing'>
              <CreatePricing />
            </TabsContent>
            <TabsContent value='pricingList'>
              <PricingList />
            </TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent value='postList'>
          <PostList />
        </TabsContent>
        <TabsContent value='account'>
          <AccountList />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Dashboard;

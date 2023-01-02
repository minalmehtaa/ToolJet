import React from 'react';
import Search from '../Search';
import List from '../TableList';
import CreateTableDrawer from '../Drawers/CreateTableDrawer';

export default function Sidebar() {
  return (
    <div className="tooljet-database-sidebar col border-bottom">
      <div className="sidebar-container border-bottom border-end px-4 py-3 pb-0">
        <CreateTableDrawer />
        <Search />
      </div>
      <div className="col table-left-sidebar border-end">
        <div className="p-3">
          <List />
        </div>
      </div>
    </div>
  );
}

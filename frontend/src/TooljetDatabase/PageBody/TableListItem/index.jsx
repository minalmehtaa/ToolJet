import React, { useState, useContext } from 'react';
import cx from 'classnames';

import { toast } from 'react-hot-toast';
import { tooljetDatabaseService } from '@/_services';
import { ListItemPopover } from './ActionsPopover';
import { TooljetDatabaseContext } from '../../index';

import Drawer from '@/_ui/Drawer';
import EditTableForm from '../../Forms/TableForm';

export const ListItem = ({ active, onClick, text = '', onDeleteCallback }) => {
  const { organizationId, columns, selectedTable, setTables } = useContext(TooljetDatabaseContext);
  const [isEditTableDrawerOpen, setIsEditTableDrawerOpen] = useState(false);

  const handleDeleteTable = async () => {
    const shouldDelete = confirm(`Are you sure you want to delete the table "${text}"?`);
    if (shouldDelete) {
      const { error } = await tooljetDatabaseService.deleteTable(organizationId, text);

      if (error) {
        toast.error(error?.message ?? `Failed to delete table "${text}"`);
        return;
      }

      toast.success(`Table "${text}" deleted successfully`);
      onDeleteCallback && onDeleteCallback();
    }
  };

  const handleEdit = async (tableName) => {
    // const { error } = await tooljetDatabaseService.updateTable(organizationId, selectedTable, tableName);
    // if (error) {
    //   toast.error(error?.message ?? `Error editing table "${selectedTable}"`);
    //   return;
    // }
    // toast.success(`Edited table "${selectedTable}"`);
  };

  const formColumns = columns.reduce((acc, column, currentIndex) => {
    acc[currentIndex] = { column_name: column.Header, data_type: column.dataType };
    return acc;
  }, {});

  return (
    <div
      className={cx('table-list-item list-group-item cursor-pointer list-group-item-action text-capitalize border-0', {
        'bg-light-indigo': active,
        active,
      })}
      onClick={onClick}
    >
      <span className="table-name">{text}</span>
      <div className="float-right cursor-pointer table-list-item-popover">
        <ListItemPopover onEdit={() => setIsEditTableDrawerOpen(true)} onDelete={handleDeleteTable} />
      </div>
      <Drawer
        disableFocus={true}
        isOpen={isEditTableDrawerOpen}
        onClose={() => setIsEditTableDrawerOpen(false)}
        position="right"
      >
        <EditTableForm
          selectedColumns={formColumns}
          selectedTable={selectedTable}
          onEdit={() => {
            tooljetDatabaseService.findAll(organizationId).then(({ data = [] }) => {
              if (Array.isArray(data?.result) && data.result.length > 0) {
                setTables(data.result || []);
              }
            });
            setIsEditTableDrawerOpen(false);
          }}
          onClose={() => setIsEditTableDrawerOpen(false)}
        />
      </Drawer>
    </div>
  );
};
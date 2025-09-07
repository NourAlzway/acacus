import { UserSearch } from './UserSearch';
import { UserList } from './UserList';
import { SelectedUserPanel } from './SelectedUserPanel';
import { AddUserForm } from './AddUserForm';

export const UserManagementApp = () => {
  return (
    <div className={'container'}>
      <header className={'header'}>
        <div>
          <h1 className={'title'}>User Management System</h1>
          <p className={'subtitle'}>
            Demonstrating reactive state management with Acacus
          </p>
        </div>
      </header>
      <div className={'mainGrid'}>
        <div className={'leftColumn'}>
          <UserSearch />
          <UserList />
        </div>

        <div className={'rightColumn'}>
          <AddUserForm />
          <SelectedUserPanel />
        </div>
      </div>
    </div>
  );
};

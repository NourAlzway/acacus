import { userStore } from './UserStore';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input, Select } from '../../components/Input';

export const UserSearch = () => {
  // State access
  const searchTerm = userStore.get(state => state.searchTerm);
  const filter = userStore.get(state => state.filter);

  // Action access
  const setSearchTerm = userStore.use(actions => actions.setSearchTerm);
  const setFilter = userStore.use(actions => actions.setFilter);
  const clearSearch = userStore.use(actions => actions.clearSearch);

  return (
    <div className={'leftColumn'}>
      <Card title="Search & Filter">
        <div className={'searchGrid'}>
          <Input
            label="Search"
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
          />

          <Select
            label="Filter"
            value={filter}
            onChange={e =>
              setFilter(e.target.value as 'all' | 'active' | 'inactive')
            }
          >
            <option value="all">All Users</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </Select>

          <Button onClick={clearSearch} variant="secondary">
            Clear
          </Button>
        </div>
      </Card>
    </div>
  );
};

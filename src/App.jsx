/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

// const products = productsFromServer.map((product) => {
//   const category = null; // find by product.categoryId
//   const user = null; // find by category.ownerId

//   return null;
// });

// Commit for RULES
export const App = () => {
  const [data, setData] = useState(productsFromServer);
  const [userFilter, setUserFilter] = useState(null);
  const [nameFilter, setNameFilter] = useState('');
  const [filterCategories, setFilterCategories] = useState([]);

  const filterCategoriesForProducts = () => {
    setData(prev => {
      return [...prev].reduce((acc, curr) => {
        if (filterCategories.includes(curr.categoryId)) {
          acc.push(curr);

          return acc;
        }

        return acc;
      }, []);
    });
  };

  const handlerUserFilter = user => {
    if (user !== null) {
      const findCategoriesForUser = categoriesFromServer.filter(
        category => category.ownerId === user,
      );

      setData(prev => {
        return [...prev].reduce((acc, curr) => {
          if (findCategoriesForUser.find(e => e.id === curr.categoryId)) {
            acc.push(curr);

            return acc;
          }

          return acc;
        }, []);
      });
    }
  };

  const nameHandlerFilter = e => {
    setNameFilter(e.target.value.trim());
  };

  const filteredForName = () => {
    setData(prev => {
      return [...prev].filter(filter =>
        // eslint-disable-next-line
        filter.name.toLowerCase().includes(nameFilter.trim().toLowerCase()));
    });
  };

  const filterCategoriesHandler = id => {
    setFilterCategories(prev =>
      // eslint-disable-next-line
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  useEffect(() => {
    setData(productsFromServer);
    if (userFilter) {
      handlerUserFilter(userFilter);
    }

    if (nameFilter !== '') {
      filteredForName();
    }

    if (filterCategories.length > 0) {
      filterCategoriesForProducts();
    }
  }, [userFilter, nameFilter, filterCategories]);
  const getInfoForCategory = id => {
    const findCategory = categoriesFromServer.find(
      category => category.id === id,
    );

    if (findCategory) {
      return `${findCategory.icon} - ${findCategory.title}`;
    }

    return null;
  };

  const getInfoForOwner = id => {
    const findOwnerId = categoriesFromServer.find(
      category => category.id === id,
    ).ownerId;
    const findOwner = usersFromServer.find(e => e.id === findOwnerId);

    if (findOwner) {
      return findOwner;
    }

    return null;
  };

  const resetAllFilters = () => {
    setFilterCategories([]);
    setNameFilter('');
    setUserFilter(null);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={`${!userFilter ? 'is-active' : null}`}
                onClick={() => setUserFilter(null)}
              >
                All
              </a>

              {usersFromServer.map(e => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={e.id}
                  className={`${e.id === userFilter ? 'is-active' : null}`}
                  onClick={() => setUserFilter(e.id)}
                >
                  {e.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={nameFilter}
                  onChange={nameHandlerFilter}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {nameFilter && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setNameFilter('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setFilterCategories([])}
              >
                All
              </a>

              {categoriesFromServer.map(e => (
                <a
                  data-cy="Category"
                  className={`button mr-2 my-1 ${filterCategories.includes(e.id) ? 'is-info' : ''}`}
                  href="#/"
                  key={e.id}
                  onClick={() => filterCategoriesHandler(e.id)}
                >
                  {e.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {data.length > 0 ? (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map(e => (
                  <tr data-cy="Product" key={e.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {e.id}
                    </td>

                    <td data-cy="ProductName">{e.name}</td>
                    <td data-cy="ProductCategory">
                      {getInfoForCategory(e.categoryId)}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={`${getInfoForOwner(e.categoryId).sex === 'f' ? 'has-text-danger' : 'has-text-link'}`}
                    >
                      {getInfoForOwner(e.categoryId).name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

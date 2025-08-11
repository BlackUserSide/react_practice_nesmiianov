/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import categories from './api/categories';

// const products = productsFromServer.map((product) => {
//   const category = null; // find by product.categoryId
//   const user = null; // find by category.ownerId

//   return null;
// });

// Commit for RULES
export const App = () => {
  const [data, setData] = useState(productsFromServer);
  const [userFilter, setUserFilter] = useState(null);
  const [nameFilter, setNameFilter] = useState(null)
  const handlerUserFilter = user => {
    if (user !== null) {
      const findCategoriesForUser = categories.filter(
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

  useEffect(() => {
    setData(productsFromServer);
    if (userFilter) {
      handlerUserFilter(userFilter);
    }
    if(nameFilter) {

    }
  }, [userFilter, nameFilter]);
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
                onClick={() => setUserFilter(null)}
              >
                All
              </a>

              {categoriesFromServer.map(e => (
                <a
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
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
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

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
                <tr data-cy="Product">
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
        </div>
      </div>
    </div>
  );
};

import $ from 'jquery';
import 'normalize.css';
import './index.css';

import api from './api'
import bookmarks from './bookmarks'
import store from './store'

const main = function() {
    bookmarks.render();
    bookmarks.handleBmClicked();
    bookmarks.handleNewBm();
    bookmarks.handleNewBmSubmit();
    bookmarks.handleDeleteClicked();
    bookmarks.handleFilter();
    bookmarks.handleCancel();
    console.log(store.bookmarks);
    api.read()
        .then((items) => {
            items.forEach((item) => store.newBm(item));
            bookmarks.render();
        })
};

$(main);
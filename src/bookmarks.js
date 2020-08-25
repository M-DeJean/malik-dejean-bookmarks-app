import $ from 'jquery';

import api from './api';
import store from './store';


const generateListElement = function (item) {
    if(store.rating && item.rating != store.rating) {
        return 
    }
    return `
    <ul class="bookmarks js-bookmarks">
        <li class="group2 js-list-element" data-item-id="${item.id}">
            <div class="item">
                <h2>${item.title}</h2>
                <h3>rating: ${item.rating}</h3>
            </div>
            <div class="expand ${item.show ? '': 'hidden'}">
                <div id="expand" class="expand-item">
                    <form action="${item.url}">
                        <input type="submit" value="Visit Site"/>
                    </form>
                    <button id="delete">Delete</button>
                </div>
                <div class="expand-item">Description</div>
                <div class="describe">
                    <p>${item.desc}</p>
                </div>
            </div>
        </li>
    </ul>`;
}

const generateButtons = function() {
    return `
    <div class="group1">
        <button id="new-bm" type="button">New Bookmark</button>
    </div>
    <div class="group1">
        <select name="filter" id="filter">
            <option value="">Filter</option>
            <option ${store.rating == 5 ? 'selected' : ''} value="5">5-star</option>
            <option ${store.rating == 4 ? 'selected' : ''} value="4">4-star</option>
            <option ${store.rating == 3 ? 'selected' : ''} value="3">3-star</option>
            <option ${store.rating == 2 ? 'selected' : ''} value="2">2-star</option>
            <option ${store.rating == 1 ? 'selected' : ''} value="1">1-star</option>
        </select>
    </div>`
}

const generateNewBm = function () {
    return `
    <div class="form">
        <form id="js-add-bm">
            <input type="url" class="add url" placeholder="http://yourbookmark.com" required>
            <input type="text" class="add title" placeholder="Enter abookmark title" required>
            <p>Rate your bookmark</p>
            <input type="radio" id="1" name="rating" value="1" required>
            <label for="1">*</label>
            <input type="radio" id="2" name="rating" value="2" required>
            <label for="2">* *</label>
            <input type="radio" id="3" name="rating" value="3" required>
            <label for="3">* * *</label>
            <input type="radio" id="4" name="rating" value="4" required>
            <label for="4">* * * *</label>
            <input type="radio" id="5" name="rating" value="5" required>
            <label for="5">* * * * *</label>
            <textarea class="add desc" rows="10" cols="50" wrap="physical" id="description" placeholder="Enter description (optional)"></textarea>
            <button type="submit">Create Bookmark</button>
            <button id="cancel" type="click">Cancel</button>
        </form>
    </div>`
}

const handleFilter = function () {
    $('#bookmarks').on('change', '#filter', function(e) {
       store.rating = e.target.value
       render();
    } )
}

const handleCancel = function() {
    $('#bookmarks').on('click', '#cancel', function() {
        render();
    })
}

const generateBmString = function (bookmarks) {

    const items = bookmarks.map((item) => generateListElement(item));
    return items.join('');
}

const render = function () {

    let items = [...store.bookmarks];

    const bookmarkString = generateBmString(items);
    const buttons = generateButtons();
    //$('#buttons').html(buttons)
    $(`#bookmarks`).html(buttons + bookmarkString);

};

const renderNewBm = function () {
    let newBm = generateNewBm;
    $('#bookmarks').html(newBm);
}

const handleBmClicked = function () {
    $('#bookmarks').on('click', '.js-list-element', function () {
        // $(this).find('.expand').toggleClass('hidden');
        console.log('clicked')

        let id = getId(this);
        let item = store.findId(id);
        item.show = !item.show;
        render();
    });
}

const handleNewBm = function () {
    $('#bookmarks').on('click', '#new-bm', function () {
        renderNewBm();
    });
}

const handleNewBmSubmit = function() {
    $('#bookmarks').on('submit', '.form', function (e) {
        e.preventDefault();
        const bmTitle = $('.title').val();
        const bmUrl = $('.url').val();
        const bmDesc = $('.desc').val();
        const bmRating = $("input[name='rating']:checked").val();
        api.create(bmTitle, bmUrl, bmDesc, bmRating)
            .then((newItem) => {
                store.newBm(newItem);
                render();
            });
    });
}

const getId = function(item) {
    return ($(item).closest('.js-list-element').data('item-id'));
}

const handleDeleteClicked = function() {
    $('#bookmarks').on('click', '#delete', function (e) {
        const id = getId(e.currentTarget);
        api.deleteBm(id)
            .then(() => {
                store.deleteItem(id);
                render();
            });
    });
}

export default {
    handleNewBm,
    render,
    handleBmClicked,
    handleNewBmSubmit,
    handleDeleteClicked,
    handleFilter,
    handleCancel
}
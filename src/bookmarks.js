import $ from 'jquery';

import api from './api';
import store from './store';



/*--------------------GENERATOR FUNCTIONS--------------------*/



const generateListElement = function (item) {
    //generates the list of bookmarks

    if (store.rating && item.rating != store.rating) {
        return
    }
    return `
    <ul class="bookmarks js-bookmarks">
        <li class="group2 js-list-element" data-item-id="${item.id}">
            <div class="item">
                <h2>${item.title}</h2>
                <h3>rating: ${item.rating}</h3>
            </div>
            <div class="expand ${item.show ? '' : 'hidden'}">
                <div id="expand" class="expand-item">
                    <a href="${item.url}" target="_blank">Visit Site</a>
                    <button id="delete">Delete</button>
                </div>
                <div class="expand-item">Description</div>
                <div class="describe">
                    <p>${item.desc}</p>
                </div>
            </div>
        </li>
    </ul>`;
};

const generateButtons = function () {

    //generates the filter and new bookmark buttons

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
};

const generateNewBm = function () {

    //generates page responsible for adding a new bookmark

    return `
    <div class="form">
        <form id="js-add-bm">
            <input type="url" class="add url" placeholder="http://yourbookmark.com" required>
            <input type="text" class="add title" placeholder="Enter abookmark title" required>
            <p>Rate your bookmark</p>
            <input type="radio" id="1" name="rating" value="1" required>
            <label for="1">1</label>
            <input type="radio" id="2" name="rating" value="2" required>
            <label for="2">2</label>
            <input type="radio" id="3" name="rating" value="3" required>
            <label for="3">3</label>
            <input type="radio" id="4" name="rating" value="4" required>
            <label for="4">4</label>
            <input type="radio" id="5" name="rating" value="5" required>
            <label for="5">5</label>
            <textarea class="add desc" rows="10" cols="50" wrap="physical" id="description" placeholder="Enter description (optional)"></textarea>
            <button type="submit">Create Bookmark</button>
            <button id="cancel" type="click">Cancel</button>
        </form>
    </div>`
};

const generateBmString = function (bookmarks) {

    //turns bookmars array from store into a string of HTML

    const items = bookmarks.map((item) => generateListElement(item));
    return items.join('');
};

const render = function () {

    //takes bookmarks array, turns it into HTML, updates DOM

    let items = [...store.bookmarks];

    const bookmarkString = generateBmString(items);
    const buttons = generateButtons();
    //$('#buttons').html(buttons)
    $(`#bookmarks`).html(buttons + bookmarkString);

};

const renderNewBm = function () {

    //generates html and updates DOM for adding new bookmark

    let newBm = generateNewBm;
    $('#bookmarks').html(newBm);
};

const getId = function (item) {

    //grabs the ID of the closest bookmark

    return ($(item).closest('.js-list-element').data('item-id'));
};



/*--------------------EVENT HANDLER FUNCTIONS--------------------*/



const eventHandlers = function () {


    //once filter is selected, rating is equal to number selected
    $('#bookmarks').on('change', '#filter', function (e) {
        store.rating = e.target.value
        render();
    })

    //gets rid of 'add bookmark' page if cancel is clicked
    $('#bookmarks').on('click', '#cancel', function () {
        render();
    })

    //expands item and shows description and link when clicked
    $('#bookmarks').on('click', '.js-list-element', function () {
        console.log('clicked')

        let id = getId(this);
        let item = store.findId(id);
        item.show = !item.show;
        render();
    });

    //once add bookmark button is clicked, calls function that updates DOM
    $('#bookmarks').on('click', '#new-bm', function () {
        renderNewBm();
    });

    //when new bookmark is submittes, places information from user input into new item
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

    //when delete button is clicked, grabs ID, calls API function and renders a new list without the bookmark w matching ID
    $('#bookmarks').on('click', '#delete', function (e) {
        const id = getId(e.currentTarget);
        api.deleteBm(id)
            .then(() => {
                store.deleteItem(id);
                render();
            });
    });
};

export default {
    render,
    eventHandlers
}
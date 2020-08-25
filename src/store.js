const bookmarks = [];
let error = null;
let hidden = true;
let rating = null;

const findId = function(id) {

    //searches bookmarks for item matching the passed in ID

    return this.bookmarks.find(item => item.id === id);
}

const newBm = function(bm) {
    this.bookmarks.push(bm);
};

const deleteItem = function (id) {
    this.bookmarks = this.bookmarks.filter(item => item.id !== id);
}

export default {
    bookmarks,
    error,
    hidden,
    findId,
    newBm,
    deleteItem,
    rating
}
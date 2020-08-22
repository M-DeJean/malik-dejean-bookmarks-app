const BASE_URL = 'https://thinkful-list-api.herokuapp.com/malik/bookmarks';

/*--------------------PROMISE ERROR HANDLING--------------------*/

const apiFetch = function(...args) {
    let error;
    return fetch(...args)
        .then(res => {
            if(!res.ok) {
                error = {code: res.status};
                if(!res.headers.get('content-type').includes('json')) {
                    error.message = res.statusText;
                    return Promise.reject(error);
                }
            }
            return res.json();
        })
        .then(data => {
            if(error) {
                error.message = data.message;
                return Promise.reject(error);
            }
            return data;
        });
};

/*--------------------CRUD FUNCTIONS--------------------*/

const read = function() {

    //returns bookmarks object from API

    return apiFetch(`${BASE_URL}`);
};

const create = function(title, url, desc, rating) {

    //uses POST method from API to create a new item

    const bookmark = JSON.stringify({title, url, desc, rating});

    return apiFetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: bookmark
    });
};

const deleteBm = function(id) {

    //deletes item based on unique id

    return apiFetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
    });
};




export default {
    create,
    read,
    deleteBm
};
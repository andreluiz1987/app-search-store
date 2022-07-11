import api from './api'

function facets(urlFacets) {
    return new Promise((res, reject) => {
        api
            .get(urlFacets)
            .then((response) => {
                res(response)
                return response
            })
            .catch((err) => {
                reject(err);
            });
    })

}

function search(urlSearch) {
    return new Promise((res, reject) => {
        api
            .get(urlSearch)
            .then((response) => {
                res(response)
                return response
            })
            .catch((err) => {
                reject(err);
            });
    })
}

function autocomplete(urlSearch) {
    return new Promise((res, reject) => {
        api
            .get(urlSearch)
            .then((response) => {
                res(response)
                return response
            })
            .catch((err) => {
                reject(err);
            });
    })
}

export { facets, search, autocomplete };

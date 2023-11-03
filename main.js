const API = 'https://restcountries.com/v3.1/all'
const APISEARCH = 'https://restcountries.com/v3.1/name'
let box = document.querySelector('.box')
let input = document.querySelector('.input')
let btn = document.querySelector('.btn')
let list = document.querySelector('.list')
let loading = document.querySelector('.loading')
let itemsPerPage = 12
let totalPage = 0

function calling(api) {
    loading.classList.remove('none')
    box.innerHTML = null
    list.innerHTML = null
    let functionData = fetch(api).then((request) => {
        loading.classList.add('none')
        return request.json()
    })
    return functionData
}

function rendering(array) {
    list.innerHTML = null
    totalPage = Math.ceil(array.length / itemsPerPage)
    let startPage = 0

    function innerFunc(array) {
        box.innerHTML = null
        let found = false

        array.slice(startPage, startPage + itemsPerPage).forEach((element) => {
            let mainDiv = document.createElement('div')
            mainDiv.classList.add('mainDiv')

            let img = document.createElement('img')
            img.src = element.flags.png
            img.classList.add('img')

            let innerBox = document.createElement('div')
            innerBox.classList = 'inner__box'

            let title = document.createElement('h2')
            title.textContent = element.name.common
            title.classList = 'title'


            let population = document.createElement('p')
            population.textContent = `Population: ${element.population}`
            population.classList = 'info__text'

            let currency = document.createElement('p')
            currency.classList = 'info__text'

            if (element && element.currencies) {
                currencyResult = Object.values(element.currencies)[0].name
            }

            currency.textContent = `Currency: ${currencyResult}`

            let language = document.createElement('p')
            language.classList = 'info__text'
            if (element && element.currencies) {
                languageResult = Object.values(element.languages)
            }

            language.textContent = `Languages: ${languageResult.join(', ')}`

            innerBox.append(title, population, currency, language)

            mainDiv.append(img, innerBox)
            box.appendChild(mainDiv)
            found = true
        })

        if (found) {
            loading.classList.add('none')
        } else {
            loading.classList.remove('none')
        }
    }

    for (let i = 0; i < totalPage; i++) {
        let item = document.createElement('li')
        item.classList = 'item'

        item.textContent = i + 1

        list.appendChild(item)
        list.firstChild.dataset.special = 'stay'
        list.firstChild.classList.add('item-active')
        if (list.firstChild.nextElementSibling) {
            list.firstChild.nextElementSibling.dataset.special = 'stay'
        }
        if (item.textContent == '3') {
            item.dataset.special = 'stay'
        }
        if (item.textContent == `${totalPage-1}`) {
            item.dataset.special = 'stay'
        }
        if (item.textContent == `${totalPage}`) {
            item.dataset.special = 'stay'
        }

        list.addEventListener('click', (e) => {
            if (e.target.tagName == 'LI') {
                let items = document.querySelectorAll('.item')
                items.forEach((el) => {
                    el.classList.remove('item-active')
                    el.removeAttribute('data-special')

                })
                e.target.dataset.special = 'stay'
                list.lastElementChild.dataset.special = 'stay'
                list.firstChild.dataset.special = 'stay'
                if (e.target.textContent == '2') {
                    list.lastElementChild.previousElementSibling.dataset.special = 'stay'
                }
                if (e.target.textContent == '20') {
                    list.firstElementChild.nextElementSibling.dataset.special = 'stay'
                }
                if (e.target.previousElementSibling) {
                    e.target.previousElementSibling.dataset.special = 'stay'
                } else {
                    e.target.nextElementSibling.dataset.special = 'stay'
                    e.target.nextElementSibling.nextElementSibling.dataset.special = 'stay'
                    list.lastElementChild.previousElementSibling.dataset.special = 'stay'
                }
                if (e.target.nextElementSibling) {
                    e.target.nextElementSibling.dataset.special = 'stay'
                } else {
                    e.target.previousElementSibling.dataset.special = 'stay'
                    e.target.previousElementSibling.previousElementSibling.dataset.special = 'stay'
                    list.firstElementChild.nextElementSibling.dataset.special = 'stay'
                }
                item.style.display = 'block'
                if (!item.hasAttribute('data-special')) {
                    item.style.display = 'none'
                }

                window.scrollTo(0, 0)
                e.target.classList.add('item-active')
                startPage = itemsPerPage * (e.target.textContent - 1)
                innerFunc(array)

            }
        })

        item.style.display = 'block'
        if (!item.hasAttribute('data-special')) {
            item.style.display = 'none'
        }
    }

    innerFunc(array)
}
let errorText = document.querySelector('.error')
calling(API).then((datas) => {
    rendering(datas)

    btn.addEventListener('click', () => {
        let inputValue = input.value

        if (inputValue.trim() != '') {
            calling(`${APISEARCH}/${inputValue.trim()}`).then((searchedData) => {
                errorText.textContent = ``
                rendering(searchedData)
            }).catch((error) => {
                errorText.textContent = `Ma'lumot topilmadi!`
            })
        } else {
            calling(API).then((dataN) => {
                errorText.textContent = ``
                rendering(dataN)
            })
        }
    })
})
// Створюю клас телефонна книна
class PhoneBook {
    constructor(name, phone) {
        this.name = name;
        this.phone = phone;

    }
}
// Створюю UI клас
class UI {
    // Створюю tr і додаю стовбчики
    AddPhoneNumber(number) {
        const list = document.getElementById('phone-list')

        const row = document.createElement('tr')
        row.className = 'for-filter'
        row.innerHTML = `
    <td>${number.name}</td>
    <td>${number.phone}</td>
    <td>
    <a href='#' class='delete'>X</a>
    </td>
 `

        list.appendChild(row)
    }

    // Сповіщення
    showAlert(message, className) {
        const div = document.createElement('div')

        div.className = `alert ${className}`
        div.appendChild(document.createTextNode(message))
        const container = document.querySelector('.container')
        const form = document.querySelector('#phone-form')
        container.insertBefore(div, form)
        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 3000)
    }
    // Видаляю контакт
    deletePhone(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove()
        }
    }
    // Очищаю поля після додавання контакту
    clearFields() {
        document.getElementById('name').value = ''
        document.getElementById('phone').value = '380'
    }
}

// Створюю клас сховища
class Store {
    static getPhone() {
        let phones
        if (localStorage.getItem('phones') === null) {
            phones = []
        } else {
            phones = JSON.parse(localStorage.getItem('phones'))
        }
        return phones
    }

    static displayPhone() {
        const phones = Store.getPhone()
        phones.forEach(function (phone) {
            const ui = new UI
            ui.AddPhoneNumber(phone)
        })

    }

    static addPhone(phone) {
        const phones = Store.getPhone()

        phones.push(phone)

        localStorage.setItem('phones', JSON.stringify(phones))
    }

    static removePhone(number) {
        const phones = Store.getPhone()
        phones.forEach(function (phone, index) {
            if (phone.phone === number) {
                phones.splice(index, 1)
            }
        })

        localStorage.setItem('phones', JSON.stringify(phones))
    }
}




// Подія для видалення контакту
document.getElementById('phone-list').addEventListener('click', function (e) {

    const ui = new UI

    if (e.target.classList.contains('delete')) {
        const row = e.target.parentElement.parentElement;

        if (row && row.children.length >= 2) {
            const phoneNumber = row.children[1].textContent;

            Store.removePhone(phoneNumber)
            ui.deletePhone(e.target)
            ui.showAlert('Контакт видалено!', 'success')
        }
        e.preventDefault()
        return
    }
    // Рудагування номеру
    if (e.target.tagName === 'TD') {
        const row = e.target.parentElement
        const name = row.children[0].textContent
        const phone = row.children[1].textContent

        document.getElementById('name').value = name;
        document.getElementById('phone').value = phone;
        editPhone = phone
    }
    e.preventDefault()

})


let editPhone = null
// Подія для додавання контакту
document.addEventListener('DOMContentLoaded', Store.displayPhone)
document.getElementById('phone-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value

    const phoneBook = new PhoneBook(name, phone)

    const ui = new UI

    if (name === '' || phone === '') {
        ui.showAlert('Заповніть поля!', 'error')
         ui.clearFields()
        return
    }
    if (!phone.startsWith('380') || phone.length != 12) {
        ui.showAlert('Некоректні дані', 'error')
        ui.clearFields()
        return
    }
    if (editPhone) {

        Store.removePhone(editPhone)
        Store.addPhone(phoneBook)
        ui.showAlert('Контакт оновлено!', 'success')
        //  Історія змін
        let val = new Date()
        const mm = (val.getMonth() + 1 < 10 ? '0' : '') + (val.getMonth() + 1);
        const dd = (val.getDate() < 10 ? '0' : '') + val.getDate();
        const yyyy = val.getFullYear();
        const hh = val.getHours()
        const min = (val.getMinutes() < 10 ? '0' : '') + val.getMinutes()

        const today = `${dd}.${mm}.${yyyy} ${hh}:${min}`
        const edit = document.getElementById('edit')
        edit.innerHTML += `${today} Зміна номеру: ${JSON.stringify(phoneBook.name)} ${editPhone} -> ${JSON.stringify(phoneBook.name)} ${JSON.stringify(phoneBook.phone)} <br>`

        editPhone = null
        // Перевірка на дублікат
    } else if (localStorage.getItem('phones').includes(name)) {
        ui.showAlert(`Контакт з іменем ${name} вже існує`, 'error')
         ui.clearFields()
    } else if (localStorage.getItem('phones').includes(phone)) {
        ui.showAlert(`Контакт з номером ${phone} вже існує`, 'error')
         ui.clearFields()
    } else {
        Store.addPhone(phoneBook)
        ui.showAlert('Контакт додано!', 'success')
    }
    document.getElementById('phone-list').innerHTML = '';
    Store.displayPhone();
    ui.clearFields();
})

// Пошук контактів
const filter = document.getElementById('filter')
filter.addEventListener('keyup', filterPhone)

function filterPhone(e) {
const phoneName = e.target.value.toLowerCase()

document.querySelectorAll('.for-filter').forEach(function(name) {
 const item = name.textContent
 if(phoneName === '' || item.toLowerCase().indexOf(phoneName) != -1) {
      name.style.display = 'table-row'
    } else {
      name.style.display = 'none'
    }
})
}


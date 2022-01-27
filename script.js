

 // получаем доступ к диву модального окна что бы его закрывать при сохранении
 const modalWrapper = document.querySelector('.modal-wrapper')      


// доступ к нопке Add User
const btnAdd = document.querySelector('.btn-add')

// доступ к таблице
const tableUsers = document.querySelector('.table-users')

let id

// создаём элементы на странице (рендерим)
const renderUser = doc =>{
    // добавим ещё айдишник для удаления элементов из базы
    const tr = `
    <tr data-id = '${doc.id}'> 
    <td >${doc.data().numberCar}</td>
    <td >${doc.data().customer}</td>
    <td >${doc.data().location}</td>
    <td >${doc.data().idOrder}</td>
    <td>
        <button class="btn btn-edit">Изменить</button>
        <button class="btn btn-delete">Удалить</button>
    </td>

    </tr>
    `
    tableUsers.insertAdjacentHTML('beforeend', tr)

    //редактируем записи
    const btnEdit = document.querySelector(`[data-id = '${doc.id}'] .btn-edit`)//обязательно пробел после кв. скобок
    btnEdit.addEventListener('click', ()=>{
        editModal.classList.add('modal-show')
        id = doc.id
        editModalForm.numberCar.value = doc.data().numberCar
        editModalForm.customer.value = doc.data().customer
        editModalForm.location.value = doc.data().location
        editModalForm.idOrder.value = doc.data().idOrder
    })

    // Удаляем записи
    const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`)//айдишник для удаления
    btnDelete.addEventListener('click', ()=>{
        db.collection('wagon').doc(`${doc.id}`).delete().then(()=>{

        })
    })
}

// доступ к модальному окну
const editModal = document.querySelector('.edit-modal')
// доступ к форме
const editModalForm = document.querySelector('.edit-modal .form')

// доступ к модальному окну редактирования
const addModal = document.querySelector('.add-modal')
// доступ к форме редактирования
const addModalForm = document.querySelector('.add-modal .form')

// открываем модальное окно
btnAdd.addEventListener('click', ()=>{// не пугаемся это тоже самое что и я делал всегда через onclick
    addModal.classList.add('modal-show')// а его создаём в css

    // делаем поля ввода в модальном окне пустыми
    addModalForm.numberCar.value = ''
    addModalForm.customer.value = ''
    addModalForm.location.value = ''
    addModalForm.idOrder.value = ''
})

// закрываем модальное окно если кликнуть не на нём
window.addEventListener('click', e  =>{
    
    if(e.target === addModal){
        addModal.classList.remove('modal-show')  
    }
    if(e.target === editModal){
        editModal.classList.remove('modal-show')
    }
    
})//ну и прописываем анимацию

// пошла работа с firebase

//находим записи в базе и рендерим на страничку
// db.collection('wagon').get().then(querySnapshot =>{
//     querySnapshot.forEach(doc =>{
//         renderUser(doc)
//     })
// })

// Делаем всё в реальном времени
db.collection('wagon').onSnapshot(snapshot =>{
    snapshot.docChanges().forEach(change =>{
        if(change.type === 'added'){// добавляем в реальном времени
            renderUser(change.doc)
        }
        if(change.type === 'removed'){// удаляем в реальном времени
            let tr = document.querySelector(`[data-id='${change.doc.id}']`)
            let tbody = tr.parentElement
            tableUsers.removeChild(tbody)
        }
        if(change.type === 'modified'){// и изменяем в реальном времени
            let tr = document.querySelector(`[data-id='${change.doc.id}']`)
            let tbody = tr.parentElement
            tableUsers.removeChild(tbody)
            renderUser(change.doc)
        }
    })
})

//добавляем записи в базу через модальное окно
addModalForm.addEventListener('submit', e=>{
    e.preventDefault()// запрещаем перегружаться странице
    // если поля пустые то ничего не записывается
    if(addModalForm.numberCar.value, addModalForm.customer.value, addModalForm.location.value, addModalForm.idOrder.value){
        db.collection('wagon').add({
            numberCar: addModalForm.numberCar.value,
            customer: addModalForm.customer.value,
            location: addModalForm.location.value,
            idOrder: addModalForm.idOrder.value
        })
    }
       

    modalWrapper.classList.remove('modal-show')// Закрываем его через созданное css свойство
})

// отправляем данные в модальном окне редактирования
editModalForm.addEventListener('submit', e=>{
    e.preventDefault()// запрещаем перегружаться странице
    
        db.collection('wagon').doc(id).update({
            numberCar: editModalForm.numberCar.value,
            customer: editModalForm.customer.value,
            location: editModalForm.location.value,
            idOrder: editModalForm.idOrder.value
        })
           
        

    editModal.classList.remove('modal-show')// Закрываем его через созданное css свойство
})












// Books Class
class Book{
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class
class UI{
    static showBooks(){
      

        const books = BookStorage.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
            `;


         list.appendChild(row);   
    }

    static resetField(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';

    }

    static removeBook(item){
        if(item.classList.contains('delete')){
            item.parentElement.parentElement.remove();
        }
    }

    static alertDialog(msg, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(msg));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form-id');
        container.insertBefore(div,form);

        setTimeout(() => document.querySelector('.alert').remove(),2000);

    }
}


//Handling Local Storage
class BookStorage{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    
    static addBook(book){
        const books = BookStorage.getBooks();

        books.push(book);

        localStorage.setItem('books',JSON.stringify(books));

    }
    static delBook(isbn){
        const books = BookStorage.getBooks();

        books.forEach((book,index) => {
            if(book.isbn === isbn){
                books.splice(index,1);
            }
        });

        localStorage.setItem('books',JSON.stringify(books)); 
    }
}


document.addEventListener('DOMContentLoaded',UI.showBooks);


// Adding books
document.querySelector('#book-form-id').addEventListener('submit', (e) => {

    e.preventDefault();


    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validating fields
    if(title === '' || author === '' || isbn === ''){
        UI.alertDialog('Please fill in all fields', 'danger')
    } else{

        //Creating book Object
        const book = new Book(title,author,isbn);

        // Adding Books to UI
        UI.addBookToList(book);

        // Add to local Storage
        BookStorage.addBook(book);

        //Alert
        UI.alertDialog('Book Added', 'success')

    
        // Reset Fields
        UI.resetField();
    }

});


// Removing Books
document.querySelector('#book-list').addEventListener('click' ,(e) => {
    //remove from UI
    UI.removeBook(e.target);

    //Alert
    UI.alertDialog('Book Removed', 'success');

    // Remove from LocalStorage
    BookStorage.delBook(e.target.parentElement.previousElementSibling.textContent);

});


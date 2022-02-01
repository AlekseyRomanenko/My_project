	const URL = 'data.json'; // файл с базой данных
	const shop = document.querySelector('.shop'); // контейнер, в котором будет магазин
	let data; // сюда будем сохранять данные из базы
	let cart = []; // здесь будет жить массив добавленных в корзину
	let spanCount = document.querySelector('.cart_count'); // количество в хедере
	let spanTotal = document.querySelector('.cart_total'); // сумма в хедере
	let cartTotal = 0; // изначальная сумма товаров в корзине
	let cartCount = 0;// изначальное количество товаров в корзине
	const select = document.getElementById('sort'); // ссылка на селект для сортировки
	const cart_modal = document.querySelector('.cart_preview'); // модальное окно с корзиной

	select.onchange = (e) => sortShop(e.target.value); // когда выбираем опцию в селекте, получаем значение опции (цена или имя) и вызываем функцию сортировки

// получаем базу данных
	const xhr = new XMLHttpRequest(); // создали запрос
	xhr.open('GET', URL, true); // настроили
	xhr.send(); // отправили

	xhr.onload = () => {
		// по загрузке сохраняем массив с данными и строим верстку
		data = JSON.parse(xhr.response);
		buildLayout(data);
	}


	function buildLayout(d) {
		// перебираем каждый элемент из базы и делаем под него верстку
		for(let item of d){
			// родительский элемент с дата-айди
			let wrap = document.createElement('div');
			wrap.classList.add('item');
			wrap.dataset.id = item.name;

			// картинка 
			let image = new Image();
			image.src = item.img;
			// название
			let title = document.createElement('h2');
			title.classList.add('name');
			title.textContent = item.name;
			// цена
			let price = document.createElement('div');
			price.classList.add('price');
			price.textContent = item.price;
			// кнопка "купить"
			let btn = document.createElement('button');
			btn.classList.add('buy');
			btn.innerHTML = `Add to <img src="/img/cart.png">`;
			// вставляем внутренние элементы в обертку
			wrap.append(image);
			wrap.append(title);
			wrap.append(price);
			wrap.append(btn);
			// и обертку как товар в магазин
			shop.append(wrap);
		}
	}

// делегируем документу прослушивание кликов
	document.addEventListener('click', function(event){
		if(event.target.classList.contains('buy')){
			// купить товар
			addToCart(event.target.parentNode.dataset.id);
		}

		if(event.target.classList.contains('less')){
			// уменьшить количество
			changeCount(event.target.parentNode, '-1');
		}
		if(event.target.classList.contains('more')){
			// увеличить количество
			changeCount(event.target.parentNode, '1');
		}
		if(event.target.classList.contains('delete')){
			// удалить товар из корзины

			let promise = new Promise((resolve, reject) => {
				confirm('Are you sure? Delete item?') ? resolve() : reject('Item was not deleted') ;
			});

			promise.then(() => deleteFromCart(event.target.parentNode.dataset.id), (err)=>alert(err));
		}
	});

// изменение количества товара +/-
// в функцию приходит ссылка на обертку (-1+) и как мы планируем изменять количество
	function changeCount(el, count){
		let newCount; // новое количество товара
		let id = el.parentNode.dataset.id; // id по которому будем искать в массиве cart
		let spanWithCount = el.querySelector('.item_count'); // элемент, в котором будет меняться число товаров		
		let totalSumEl = el.parentNode.querySelector('.item_total'); // сумма по товару (элемент)
		let totalSum = +totalSumEl.innerText; // сумма по товару (число)

		cart.forEach(item => {
			if(item.name == id){
				// перебираем корзину и отбираем совпадение по id
				if(item.count == 1 && count == '-1'){
					// если элемент в корзине представлен в количестве 1, удаляем его и выходим из этой функции
					deleteFromCart(id);
					return;
				}
				// изменяем количество товара, сумму по нему и общие цифры по корзине (суммарно, в хедере)
				item.count += Number(count);
				cartCount+= Number(count);
				newCount = item.count; 
				totalSum += item.price *Number(count);
				cartTotal += item.price *Number(count);
				spanWithCount.innerText = newCount;
				totalSumEl.innerText = totalSum;
			}
		});

				// меняем числа в хедере
		spanTotal.innerText = cartTotal;
		spanCount.innerText =  cartCount;

	}


	function deleteFromCart(id){

		let itemsInCart = document.querySelectorAll('.in_cart');
		for(let i of itemsInCart){
			if(i.dataset.id == id){
				i.remove(); // удаляем из верстки
			}	
		}
		// удаляем из корзины
		cart.forEach((item, index) => {
			if(item.name == id){
				cartTotal -= item.price * item.count;
				cartCount -= item.count;
				cart.splice(index, 1);
			}
		});

		// меняем числа в хедере
		spanTotal.innerText = cartTotal;
		spanCount.innerText =  cartCount;
	}

// добавляем товар в корзину из общего списка на главной странице
	function addToCart(id){
		let bought;  // товар, который купили
		let wasInCart = false; //был ли он в корзине (предположительно нет)

		data.forEach(item => {
			if(item.name == id){
				cartTotal += item.price; // добавляем в общую сумму в хедере цену товара
				bought = item; //выбрали товар, который купили
			}
		});

		cart.forEach(inCart => {
			// проверяем, был ли товар уже в корзине
			if(inCart.name == bought.name){
				wasInCart = true;
				// если да - только меняем его количество
				inCart.count += 1;
			}
		})

		if(!wasInCart){
			// если товара в корзине не было, добавляем в количестве 1шт
			cart.push({ count: 1, ...bought});
		}

		
		cartCount += 1;
		// общее количество товаров увеличиваем на 1

		// меняем текст в хедере
		spanTotal.innerText = cartTotal;
		spanCount.innerText =  cartCount;

		// перестраиваем верстку в модальном окне корзины
		cart_modal.innerHTML = '';
		cart.forEach(item => showInModal(item));
	}

	// верстка модального окна
	function showInModal(obj){
		// создаем обертку для элемента
		let wrap = document.createElement('div');
		wrap.classList.add('in_cart');
		wrap.dataset.id = obj.name;
		// его картинка
		let img = new Image();
		img.src = obj.img;
		// его название
		let itemName = document.createElement('h5');
		itemName.innerText = obj.name;

		// кнопки + - и количество делаем внутри отдельного span
		let less = document.createElement('button');
		less.classList.add('less');
		less.innerText = '-';

		let itemCount = document.createElement('span');
		itemCount.classList.add('item_count');
		itemCount.innerText = obj.count;

		let more = document.createElement('button');
		more.classList.add('more');
		more.innerText = '+';

		let itemControls = document.createElement('span');
		itemControls.append(less);
		itemControls.append(itemCount);
		itemControls.append(more);

		// сумма по товару (кол*цена)
		let itemTotal = document.createElement('span');
		itemTotal.classList.add('item_total');
		itemTotal.innerText = obj.count * obj.price;
		// кнопка "удалить товар"
		let del_btn = new Image();
		del_btn.src = '/img/delete.png';
		del_btn.classList.add('delete');

		// вставляем элементы в обертку
		wrap.append(img);
		wrap.append(itemName);
		wrap.append(itemControls);
		wrap.append(itemTotal);
		wrap.append(del_btn);
		// и обертку в модалку
		cart_modal.append(wrap);
	}

	// сортировка товаров принимает параметр цена или имя
	function sortShop(param){
		// отбираем элементы, по которым будем сортировать
		let items = document.querySelectorAll(`.item .${param}`); //  => .item .name || .item .price
		items = Array.prototype.slice.call(items); //и превращаем их в массив

		//сортируем 
		items.sort(function(a, b){
			if(param == 'price'){
				// получаем текст отобранных элементов
				// если параметр - цена, то для корректной сортировки нужно привести к типу данных Number
				a = +a.innerText;
				b = +b.innerText;	
			}
			else{
				// получаем текст отобранных элементов
				a = a.innerText;
				b = b.innerText;
			}
			if(a> b){
				return 1;
			}
			else if(a < b){
				return -1;
			}
			else{
				return 0;
			}
		});
		// для того, чтобы в верстке поменялся порядок элементов, родителю (.item) добавляем свойство order с порядковым номером в отсортированном массиве
		items.forEach((el, index) => el.parentNode.style.order = index);
	}
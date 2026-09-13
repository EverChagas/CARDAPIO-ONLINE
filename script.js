const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

// Abrir o Modal do carrinho
cartBtn.addEventListener("click", function () {
    cartModal.style.display = "flex"
    updateCartModal();
})

// Fechar o Modal quando clicar fora
cartModal.addEventListener("click", function (event) {
    if(event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    // console.log(event.target) toda vez que clicamos em algum item o console nos devolve a informação do que estamos clicando
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart (name, price) 
    }
})


// Função para adicionar no carrinho
function addToCart (name, price) {
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        // Se o item já existe, aumenta apenas a quantidade + 1
        existingItem.quantity += 1;
    }else{
        cart.push({
        name,
        price,
        quantity: 1,
        
    })
    }

    updateCartModal()
}

// Atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const cartItemElement = document.createElement("div");
        cartItemElement.className = "flex justify-between items-center border-b py-2";

        cartItemElement.innerHTML = `
            <div class="flex justify-between items-center w-full gap-4">
               <div>
                    <p>${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p>R$ ${(item.price * item.quantity).toFixed(2)}</p>
               </div> 

                <div>
                    <button class="remove-from-cart-btn bg-red-500 text-white px-2 py-1 rounded" data-index="${index}">
                        Remover
                    </button>
                </div>

            </div>
        `

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = `R$ ${total.toFixed(2)}`
    cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0)

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// Função para remover itens do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    const removeButton = event.target.closest(".remove-from-cart-btn")

    if (removeButton) {
        const itemIndex = Number(removeButton.dataset.index)
        const item = cart[itemIndex]

        if (item.quantity > 1) {
            item.quantity -= 1
        } else {
            cart.splice(itemIndex, 1)
        }

        updateCartModal()
    }
})


// Validação dos campos de endereço
addressInput.addEventListener("input", function (event) {
    const hasAddress = event.target.value.trim() !== ""

    addressInput.classList.toggle("border-red-500", !hasAddress)
    addressInput.classList.toggle("border-green-500", hasAddress)
    addressWarn.classList.toggle("hidden", hasAddress)

})

// Finalizar carrinho
checkoutBtn.addEventListener("click", function () {
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops, o restaurante está fechado no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if (cart.length === 0) return;

    const hasAddress = addressInput.value.trim() !== ""

    if (!hasAddress) {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        addressInput.classList.remove("border-green-500")
        return;
    }

    addressWarn.classList.add("hidden")
    addressInput.classList.remove("border-red-500")
    addressInput.classList.add("border-green-500")

    //  Enviar pedido para API whats
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "015996045915"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")
    cart = [];
    updateCartModal();
})


// Verificar a hora e manipular o card horario 
function checkRestaurantOpen() {
    const data = new Date ();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; 
    //true restaurante está aberto 
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if (isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
// --- Estado del carrito ---
const cart = []; // guarda productos

// Formato COP (Colombia)
const formatCOP = n =>
  new Intl.NumberFormat("es-CO", { style:"currency", currency:"COP", maximumFractionDigits:0 }).format(n);

// Total de unidades en el badge
const updateBadge = () => {
  const count = cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById("cart-count").textContent = count;
};

// Render del panel
function renderCart(){
  const list = document.getElementById("cart-list");
  list.innerHTML = "";
  let total = 0;  //Cada vez que se cambia algo, se limpia y se vuelve a dibujar el carrito.

  cart.forEach((item, idx) => {
    total += item.price * item.qty;

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <img src="${item.image}" alt="">
      <div class="info">
        <p class="name">${item.name}</p>
        <p class="price">${formatCOP(item.price)}</p>
        <div class="qty">
          <button data-action="dec" data-index="${idx}">-</button>
          <span>${item.qty}</span>
          <button data-action="inc" data-index="${idx}">+</button>
        </div>
      </div>
      <button class="remove" data-action="remove" data-index="${idx}" aria-label="Eliminar">✕</button>
    `;
    list.appendChild(li);
  });

  document.getElementById("cart-total").textContent = formatCOP(total);
  updateBadge();
}

// Abrir/cerrar panel
const cartEl = document.getElementById("cart");
const backdrop = document.getElementById("cart-backdrop");
//Eventos para abrir/cerrar el carrito.
document.getElementById("cart-button").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);

function openCart(){ cartEl.classList.add("open"); backdrop.classList.add("show");
  
 }
function closeCart(){ cartEl.classList.remove("open"); backdrop.classList.remove("show"); }

// Clicks dentro del carrito (sumar, restar, eliminar)
document.getElementById("cart-list").addEventListener("click", (e)=>{
  const action = e.target.dataset.action;
  if(!action) return;
  const i = +e.target.dataset.index;

  if(action === "inc") cart[i].qty++;
  if(action === "dec") cart[i].qty > 1 ? cart[i].qty-- : cart.splice(i,1);
  if(action === "remove") cart.splice(i,1);

  renderCart();
});

// Agregar al carrito desde la grid
function parsePrice(text){
  return parseInt(text.replace(/[^\d]/g, ""), 10) || 0;
}

//Detecta nombre, precio e imagen. Si está en el carrito aumenta cantidad, si no lo mete con qty = 1.
document.querySelectorAll(".grid .item").forEach(item => {
  const btn = item.querySelector(".add-to-cart");
  if(!btn) return;

  btn.addEventListener("click", () => {
    const name = item.querySelector(".nombre")?.textContent.trim() || "Producto";
    const priceText = item.querySelector(".precio")?.textContent || "$0";
    const price = parsePrice(priceText);
    const image = item.querySelector("img")?.src || "";

    const found = cart.find(p => p.name === name);
    if(found){ found.qty++; }
    else{ cart.push({ name, price, image, qty: 1 }); }

    renderCart();
    openCart();
  });
});

// Botón finalizar compra
document.getElementById("checkout").addEventListener("click", ()=>{
  if(!cart.length) return alert("Tu carrito está vacío.");
  alert("Gracias por tu compra 🛍️");
  cart.length = 0;
  renderCart();
  closeCart();
});

renderCart();

function buscar() {
    let input = document.getElementById("searchInput").value.toLowerCase().trim();
    let productos = document.querySelectorAll("#productos .item");
    let encontrado = false;

    productos.forEach(prod => {
      let texto = prod.innerText.toLowerCase();
      if (texto.includes(input) && input !== "") {
        prod.style.display = "block"; // solo mostrar coincidencia
        encontrado = true;
      } else {
        prod.style.display = "none"; // ocultar lo demás
      }
    });

    // Si no encuentra nada, puedes mostrar un mensaje
    if (!encontrado && input !== "") {
      alert("Producto no encontrado");
    }

    // Si está vacío el buscador, vuelve a mostrar todos
    if (input === "") {
      productos.forEach(prod => prod.style.display = "block");
    }
  }


  
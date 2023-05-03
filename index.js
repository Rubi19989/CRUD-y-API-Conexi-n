const container = document.querySelector("#container")
const myModal = document.querySelector("#exampleModal")
const form = document.querySelector("#MyForm")
const spinerModal = document.querySelector("#spinerModal")
const btnModal = document.querySelector("#btnModal")
const API = "https://api.escuelajs.co/api/v1/";


const fetchData = async (urlApi, options = {}) => {

    let response = await fetch(urlApi, options)
    let data = await response.json();
    return data


}

const cargarInicio = async () => {
    let data = await fetchData(`${API}products`);
    misFilas(data)
    // ?offset=0&limit=10
}
cargarInicio();

const misFilas = (responseProductos) => {


    let filasAcumuladas = "";
    responseProductos.forEach((element, index) => {
        let fila = `<tr>
        <th scope="row">${index + 1}</th>
        <td class="border-end  border-dark">${element.title}</td>
        <td class="border-end  border-dark">${element.description}</td>
        <td class="border-end  border-dark">$.${element.price}</td>
        <td class="border-end  border-dark">${element.category.id}</td>
        <td class="border-end  border-dark"><img src="${element.images[0]}" style="width:100px;"></td>
        <td> <button value=${element.id} name="editar" data-bs-toggle="modal" data-bs-target="#exampleModal" 
        type="button" class="btn btn-outline-info">Editar</button> 
        <button onclick="deleteProduct(${element.id})" value=${element.id} name="eliminar"
        type="button" class="btn  my-3 btn-outline-danger">Eliminar</button></td>
    </tr>
    <tr>`
        filasAcumuladas += fila;
    });
    container.innerHTML = filasAcumuladas;
}


const createOrUpdateProducts = async (event) => {
    let title = document.querySelector("#name").value;
    let description = document.querySelector("#description").value;
    let price = document.querySelector("#price").value;
    let images = document.querySelector("#images").value;
    let category = document.querySelector("#selectCategori").value;


    let options = {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            title,
            price,
            "description": description,
            "categoryId": category,
            "images": [images]
        })

    }
    let url = `${API}products/`
    let product

    
    switch (event.target.name) {
        case "crear":
       
         product = await fetchData(url, options)

         alert(`Su producto ${product.title} ha sido agregado`);
            break;
            case "actualizar":
                options = {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: 'PUT',
                    body: JSON.stringify({
                        title,
                        price,
                        "description": description,
                        "categoryId": category,
                        "images": [images]
                    })
            
                }
                product = await fetchData(`${url}${event.target.value}`, options)
                
                alert(`${product.title} fue actualizado`)

            break;

    }



}

myModal.addEventListener('shown.bs.modal', async (event) => {
    switch (event.relatedTarget.name) {
        case "crear":
            btnModal.textContent = "Crear producto"
            btnModal.value = ""
            btnModal.name = "crear"
            spinerModal.classList.add("d-none")
            form.classList.remove("d-none")
            break;
        case "editar":
            let id = event.relatedTarget.value;
            btnModal.textContent = "Actualizar producto"
            btnModal.value = id
            btnModal.name = "actualizar"



            let product = await fetchData(`${API}products/${id}`);
            spinerModal.classList.add("d-none")
            form.classList.remove("d-none")

            document.querySelector("#name").value = product.title;
            document.querySelector("#description").value = product.description;
            document.querySelector("#price").value = product.price;
            document.querySelector("#images").value = product.images;
            document.querySelector("#selectCategori").value = product.category.id;
            break;

    }

})

myModal.addEventListener('hidden.bs.modal', () => {
    form.reset()
    spinerModal.classList.remove("d-none")
    form.classList.add("d-none")
})

let deleteP;

const deleteProduct = (id) => {
    const toastLIveExample = document.getElementById('liveToast')
    const toast = new bootstrap.Toast( toastLIveExample)
    toast.show()
    

    let options = {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'DELETE'
    }

    let btnConfirm = document.querySelector("#btnConfirm")

    btnConfirm.removeEventListener("click", deleteP)

    deleteP = async () => {
        try{
            await  fetchData(`${API}products/${id}`, options)
            alert("Se ha eliminado")
            toast.hide()

        }catch(error)
        {
            console.error(error)
        }
    };

    btnConfirm.addEventListener("click", deleteP)
}


const categoris = async () => {
    let categoriesProduct = await fetchData(`${API}categories`)
    console.log(categoriesProduct)

    let selectCategory = document.querySelector("#selectCategori")

    categoriesProduct.forEach(element => {
        selectCategory.innerHTML += ` <option value="${element.id}">${element.name}</option>`
    });
}

categoris()
// CONFIGURACAO DB
const getLocalStorage = () =>
  JSON.parse(localStorage.getItem('db_produto')) ?? []
const setLocalStorage = dbProduto =>
  localStorage.setItem('db_produto', JSON.stringify(dbProduto))

// CREATE
const createProduto = produto => {
  const dbProduto = getLocalStorage()
  dbProduto.push(produto)
  setLocalStorage(dbProduto)
}

// READ
const readProduto = () => getLocalStorage()

// UPDATE
const updateProduto = (index, produto) => {
  const dbProduto = readProduto()
  dbProduto[index] = produto
  setLocalStorage(dbProduto)
}

// DELETE
const deleteProduto = index => {
  const dbProduto = readProduto()
  dbProduto.splice(index, 1)
  setLocalStorage(dbProduto)
}

// VALIDACOES / LIMPEZA
const isValidFields = () => {
  return document.getElementById('form').reportValidity()
}

const isInvalidCodigo = () => {
  dbProduto = readProduto()
  codigo = document.getElementById('codigo').value
  codigoInvalido = false

  dbProduto.forEach(produto => {
    if (codigo == produto.codigo) {
      codigoInvalido = true
    }
  })

  console.log(codigoInvalido)

  return codigoInvalido
}

const clearFields = () => {
  const fields = document.querySelectorAll('input textarea')
  fields.forEach(field => (field.value = ' '))
}

const clearTable = () => {
  const rows = document.querySelectorAll('table>tbody tr')
  rows.forEach(row => row.parentNode.removeChild(row))
}

// INTERACOES
const saveProduto = () => {
  if (isValidFields()) {
    const produto = {
      codigo: document.getElementById('codigo').value,
      nome: document.getElementById('nome').value,
      altura: document.getElementById('altura').value,
      largura: document.getElementById('largura').value,
      profundidade: document.getElementById('profundidade').value,
      comentarios: document.getElementById('comentarios').value
    }
    const index = document.getElementById('codigo').dataset.index

    if (isInvalidCodigo()) {
      alert('Favor inserir um código não existente.')
    } else {
      if (index == 'new') {
        createProduto(produto)
        clearFields()
        loadTable()
        alert('Produto cadastrado com sucesso!!')
      } else {
        updateProduto(index, produto)
        clearFields()
        loadTable()
        alert('Dados alterados com sucesso!!')
      }
    }
  }
}

const createRow = (produto, index) => {
  const newRow = document.createElement('tr')
  newRow.innerHTML = `
    <td>${produto.codigo}</td>
    <td>${produto.nome}</td>
    <td>${produto.altura}</td>
    <td>${produto.largura}</td>
    <td>${produto.profundidade}</td>
    <td>${produto.comentarios}</td>
    <td>
        <button type="button" class="edit" id="edit-${index}">Editar</button>
        <button type="button" class="exclude" id="exclude-${index}">Excluir</button>
    </td>
    `

  document.querySelector('table>tbody').appendChild(newRow)
}

const loadTable = () => {
  const dbProduto = readProduto()
  clearTable()
  dbProduto.forEach(createRow)
}

const fillFields = produto => {
  document.getElementById('codigo').value = produto.codigo
  document.getElementById('nome').value = produto.nome
  document.getElementById('altura').value = produto.altura
  document.getElementById('largura').value = produto.largura
  document.getElementById('profundidade').value = produto.profundidade
  document.getElementById('comentarios').value = produto.comentarios
  document.getElementById('codigo').dataset.index = produto.index
}

const editProduto = index => {
  const produto = readProduto()[index]
  produto.index = index
  fillFields(produto)
}

const editExclude = event => {
  if (event.target.type === 'button') {
    const [action, index] = event.target.id.split('-')

    if (action == 'edit') {
      editProduto(index)
      console.log('Editando o produto.')
    } else {
      const produto = readProduto()[index]
      const response = confirm(
        `Deseja realmente excluir o produto "${produto.nome}"?`
      )
      if (response) {
        deleteProduto(index)
        loadTable()
        console.log('Deletando o produto.')
      }
    }
  }
}

// EVENTOS
document.getElementById('submit').addEventListener('click', saveProduto)

document.querySelector('table>tbody').addEventListener('click', editExclude)

// RUNNER
loadTable()

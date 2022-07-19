import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { activityCreated, showAllCountries } from '../redux/actions'
import stylecss from './Formularios.module.css'
import { Link, useHistory } from 'react-router-dom'

const validaciones = (input) => {
  const errores = {}

  ////////NOMBRE////////////
  if (!input.nombre.length) {
    errores.nombre = "Campo obligatorio"
  } else if (input.nombre.length < 4) {
    errores.nombre = "Actividad muy corta"
  } else if (!/^[a-zA-Z ]*$/.test(input.nombre)) {
    errores.nombre = "Sólo se permiten letras"
  }
  //////////////////////////

  ////////DIFICULTAD////////
  if (!input.dificultad.length) {
    errores.dificultad = "Campo obligatorio"
  } else if (input.dificultad < 1 || input.dificultad > 5 || input.dificultad % 1 !== 0) {
    errores.dificultad = "La dificultad debe ser entre 1 y 5"
  }
  /////////////////////////

  ////////TEMPORADA////////
  if (!input.temporada.length) {
    errores.temporada = "Campo obligatorio"
  } else if (input.temporada !== 'Verano' && input.temporada !== 'Otoño' && input.temporada !== 'Invierno' && input.temporada !== 'Primavera') {
    errores.temporada = "Solamente puedes elegir las temporadas 'Verano, Otoño, Invierno y Primavera'"
  }
  /////////////////////////

  ////////DURACION////////
  if (!input.duracion.length) {
    errores.duracion = "Campo obligatorio"
  } else if (input.duracion.length < 3) {
    errores.duracion = "Este campo debe contener un mínimo de 3 caracteres"
  }
  ///////////////////////

  return errores
}


const Formularios = () => {

  const dispatch = useDispatch()
  const paises = useSelector((state) => state.countries)
  useEffect(() => dispatch(showAllCountries()), [dispatch])
  const history = useHistory()
  const [input, setInput] = useState({
    paises: [],
    nombre: '',
    dificultad: '',
    duracion: '',
    temporada: ''
  })

  const [errores, setErrores] = useState([]);

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.name === "temporada") {
      const contenedor = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase()
      setInput({
        ...input,
        temporada: contenedor
      })
      setErrores(validaciones({
        ...input,
        temporada: contenedor
      }))
      return
    } else {
      setInput({
        ...input,
        [e.target.name]: e.target.value
      })

      setErrores(validaciones({
        ...input, [e.target.name]: e.target.value
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.dificultad.length || !input.temporada.length || !input.nombre.length || !input.duracion.length || !input.paises.length) {
      alert("Faltan completar datos.")
    } else if (errores.dificultad || errores.temporada || errores.nombre || errores.duracion) {
      alert("Revisar bien los campos completados.")
    } else {
      dispatch(activityCreated(input))
      alert("¡Actividad creada!")
      setInput({
        paises: [],
        nombre: '',
        dificultad: '',
        duracion: '',
        temporada: ''
      })
      history.push('/countries')
    }
  }

  const selectCountry = (e) => {
    e.preventDefault()

    let contenedor = [...input.paises]
    let found = contenedor.filter(p => p === e.target.value)

    if (!found.length) {
      setInput({
        ...input, paises: [...input.paises, e.target.value]
      })
    } else {
      alert("El país ya está seleccionado.")
    }
  }

  const handleDelete = (e) => {
    e.preventDefault()
    setInput({
      ...input,
      paises: input.paises.filter(p => p !== e.target.value)
    })
  }


  return (
    <div className={stylecss.esto}>
      <Link to='/countries'>
        <h3 className={stylecss.back}>Volver</h3>
      </Link>
      <div className={stylecss.fondo}>
        <h1 className={stylecss.h1}>¡Crea tu actividad!</h1>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className={stylecss.label}>Países</label>
            <select className={stylecss.input} onChange={(e) => selectCountry(e)}>
              <option hidden>Seleccionar países</option>
              {paises && paises.sort((a, b) => {
                if (a.name > b.name) {
                  return 1
                }
                if (b.name > a.name) {
                  return -1
                }
                return 0
              }).map(e => (
                <option key={e.name} value={e.name}>{e.name}</option>
              ))}
            </select> <br />
            <ul>
              {input.paises.map((e, index) => { // index: posicion de cada elemento
                console.log(index)
                return (
                  <div key={index} className={stylecss.contenedorLi}>
                    {e}
                    <button key={index} className={stylecss.delete} value={e} onClick={(e) => handleDelete(e)}>X</button>
                  </div>
                )
              })
              }
            </ul>
          </div>
          < label className={stylecss.label}>Nombre de la actividad</label>
          <input className={stylecss.input} type='text' name='nombre' value={input.nombre} maxLength={15} placeholder='Ej: Boxeo...' onChange={handleChange} />
          <br />
          {errores.nombre && (<p className={stylecss.danger}>{errores.nombre}</p>)}

          < label className={stylecss.label} > Dificultad</label>
          <input className={stylecss.input} type='number' name='dificultad' min={1} max={5} value={input.dificultad} placeholder='Ej: 5...' onChange={handleChange} />
          <br />
          {errores.dificultad && (<p className={stylecss.danger}>{errores.dificultad}</p>)}

          <label className={stylecss.label}>Duración</label>
          <input key='duracion' className={stylecss.input} type='text' name='duracion' value={input.duracion} maxLength={15} placeholder='Ej: 3 meses...' onChange={handleChange} />
          <br />
          {errores.duracion && (<p className={stylecss.danger}>{errores.duracion}</p>)}

          <label className={stylecss.label}>Temporada</label>
          <input key='temporada' className={stylecss.input} type='text' name='temporada' value={input.temporada} maxLength={9} placeholder='Ej: Verano...' onChange={handleChange} />
          <br />
          {errores.temporada && (<p className={stylecss.danger}>{errores.temporada}</p>)}

          <br />

          <input key='submit' className={stylecss.inputsolo} type='submit' value='Crear actividad' />
        </form>
      </div>
    </div >
  )
}


export default Formularios;


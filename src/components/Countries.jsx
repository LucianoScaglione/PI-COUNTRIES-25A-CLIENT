import { useState, useEffect } from 'react';
import { filtrarPaisesPorContinente, filtrarPaisesPorOrden, filtrarPaisesPorCantidad, showAllCountries, filtrarPorActividad, traerActividades } from "../redux/actions";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import style from './Countries.module.css';
import SearchBar from './SearchBar';
import Paginado from './Paginado';
import Loading from './Loading';

function Countries() {

  const dispatch = useDispatch()
  const countries = useSelector(state => state.countries)
  const activity = useSelector(state => state.activity)
  const [loader, setLoader] = useState(true)
  ////////////////////////////////// PAGINADO:////////////////////////////////////////////////
  const [paginaActual, setPaginaActual] = useState(1)
  const paisesPorPagina = 10
  const indiceUltimoPais = paginaActual * paisesPorPagina
  const indicePrimerPais = indiceUltimoPais - paisesPorPagina

  const paisActual = countries.slice(indicePrimerPais, indiceUltimoPais)
  const paginado = (pageNumber) => {
    setPaginaActual(pageNumber)
  }
  //////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////// FILTRADO://////////////////////////////////////////
  const [orden, setOrden] = useState('')

  const manejarFiltradoPorContinente = (e) => {
    e.preventDefault()
    dispatch(filtrarPaisesPorContinente(e.target.value))
    setPaginaActual(1)
  }

  const manejarFiltradoPorOrden = (e) => {
    e.preventDefault()
    dispatch(filtrarPaisesPorOrden(e.target.value))
    setPaginaActual(1)
    setOrden(e.target.value)
  }

  const manejarFiltradoPorCantidad = (e) => {
    e.preventDefault()
    dispatch(filtrarPaisesPorCantidad(e.target.value))
    setPaginaActual(1)
    setOrden(e.target.value)
  }

  const manejarFiltradoPorActividad = (e) => {
    e.preventDefault()
    dispatch(filtrarPorActividad(e.target.value))
    setPaginaActual(1)
  }
  //////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    dispatch(showAllCountries())
    dispatch(traerActividades())
    .then(() => setLoader(false))
  }, [dispatch])

  if (loader) {
    return <Loading />
  }

  return (
    <div className={style.esto}>
      <Link to='/activity'>
        <h3 className={style.activity}>Crear actividad</h3>
      </Link>

      <SearchBar setPaginaActual={setPaginaActual} />

      {/*////////////////////////////////Filtrado:////////////////////////////////////////////////*/}
      <div className={style.filtrado}>
        <select onChange={e => manejarFiltradoPorContinente(e)}>
          <option hidden>Continentes</option>
          <option value='All'>Todos</option>
          <option value='Africa'>África</option>
          <option value='Americas'>América</option>
          <option value='Antarctic'>Antártida</option>
          <option value='Asia'>Asia</option>
          <option value='Europe'>Europa</option>
          <option value='Oceania'>Oceanía</option>
        </select>

        <select onChange={e => manejarFiltradoPorOrden(e)}>
          <option hidden>Ordenar de forma</option>
          <option value='az'>A-Z</option>
          <option value='za'>Z-A</option>
        </select>

        <select onChange={e => manejarFiltradoPorCantidad(e)}>
          <option hidden>Ordenar por población</option>
          <option value='mayor'>Mayor población</option>
          <option value='menor'>Menor población</option>
        </select>

        <select onChange={e => manejarFiltradoPorActividad(e)}>
          <option hidden>Actividades turísticas</option>
          {
            activity && activity.map(a => {
              return (
                <option key={a.id} value={a.nombre}>{a.nombre}</option>
              )
            })
          }
        </select>
      </div>
      {/*/////////////////////////////////////////////////////////////////////////////////////////*/}

      {/*////////////////////////////////Paginado:////////////////////////////////////////////////*/}
      <Paginado
        paisesPorPagina={paisesPorPagina}
        countries={countries.length}
        paginado={paginado}
      />
      {/*/////////////////////////////////////////////////////////////////////////////////////////*/}

      <div className={style.contenedorCountry}>
        {
          paisActual && paisActual.map(e => {
            return (
              <div key={e.id} className={style.country}>
                <Link to={`/countries/${e.id}`} >
                  <img src={e.flags} alt='Img not found' />
                  <div key={e.id} className={style.text}>
                    <h2>{e.name}</h2>
                    <p>Continente: {e.continent}</p>
                  </div>
                </Link>
              </div>
            )
          })
        }
      </div>
    </div >
  );
}

export default Countries;















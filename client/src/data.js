// import {useState, useEffect} from 'react';

// export function useHandleCrud () {
//   const [entries, setEntries] = useState([])

//   const fetchEntries = async() => {
//     try {
//       const res = await fetch('http://localhost:8080/api/entries')
//       if (!res.ok) {
//         throw new Error('Failed to fetch entries form server.')
//       }
//       setEntries(res.json())
//     } catch (error) {
//       console.error(error)
//       return[]
//     }
//   }

// }

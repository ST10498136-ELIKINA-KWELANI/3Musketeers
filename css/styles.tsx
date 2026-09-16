
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
     flex: 1,
      backgroundColor: '#f4f5f7',
       padding: 16 
    },
  header: {
     fontSize: 20,
      fontWeight: 'bold',
       marginBottom: 12,
        textAlign: 'center' 
    },
  button: { 
    backgroundColor: '#0066cc',
     padding: 12,
      borderRadius: 8, 
      marginBottom: 12 
    },
  buttonText: {
     color: '#fff',
      textAlign: 'center', 
      fontWeight: 'bold'
     },
  card: { 
    backgroundColor: '#fff',
     padding: 12, 
     borderRadius: 8, 
      marginBottom: 12, 
      elevation: 2 
    },
  cardTitle: {
     fontWeight: 'bold',
      fontSize: 14,
       marginBottom: 6, 
       color: '#333'
     },
  reportText: { 
    fontSize: 13,
     color: '#111' 
    },
  placeholderText: { 
    fontStyle: 'italic',
     color: '#888' },
  tabContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
     marginBottom: 8 
    },
  tab: {
     backgroundColor: '#e1e4e8',
      padding: 8,
       borderRadius: 6,
        flex: 1,
         marginHorizontal: 2
         },
  tabText: { 
    fontSize: 11,
     fontWeight: 'bold',
      textAlign: 'center'
     },
  scrollArea: {
     flex: 1
     },
  logRow: {
     backgroundColor: '#fff',
      padding: 10,
       borderRadius: 6, 
       marginBottom: 8,
        borderLeftWidth: 4,
         borderLeftColor: '#0066cc'
         },
  boldText: {
     fontWeight: 'bold', 
     fontSize: 13
     },
  reasonText: { color: '#555',
     fontSize: 12,
      marginTop: 2 
    },
});
export default styles;
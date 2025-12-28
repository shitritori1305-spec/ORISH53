import React, { useEffect, useState } from 'react';
import { Text, View, Button, ScrollView } from 'react-native';

export default function App(){
  const [q, setQ] = useState(null);
  useEffect(()=>{
    fetch('http://10.0.2.2:3000/questionnaire') // emulator localhost
      .then(r=>r.json())
      .then(setQ).catch(()=>setQ({title:'שגיאה', intro:'לא הצלחנו לטעון'}));
  },[]);

  if(!q) return (<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>טוען...</Text></View>);
  return (
    <ScrollView contentContainerStyle={{padding:20}}>
      <Text style={{fontSize:22,marginBottom:8}}>{q.title}</Text>
      <Text style={{marginBottom:12}}>{q.intro}</Text>
      <Button title="פתח באתר" onPress={()=>{}} />
    </ScrollView>
  );
}

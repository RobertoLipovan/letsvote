import { TextInput, View, StyleSheet, Text } from "react-native"
import { useState } from "react"
import Input from "../components/Input"

export default function TestScreen() {

    const [variable, setVariable] = useState("")

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Input
                    placeholder="hola"
                    value={variable}
                    setValue={setVariable}
                />
                <View style={styles.participantInfo}>
                    <Text style={{
                        backgroundColor: 'blue',
                        color: 'white',
                        fontWeight: 800,
                        textAlign: 'center',
                        borderRadius: 5,
                        paddingHorizontal: 5,
                    }}>ME</Text>
                    <Text style={{
                        backgroundColor: 'green',
                        color: 'white',
                        fontWeight: 800,
                        textAlign: 'center',
                        borderRadius: 5,
                        paddingHorizontal: 5,
                    }}>OWNER</Text>
                </View>
                <View style={{
                    backgroundColor: 'black',
                    justifyContent: 'center',
                }}>
                <Text style={{
                    color: 'white'
                }}>
                    7
                </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        backgroundColor: 'grey',
        padding: 10,
        flexDirection: 'row',
        gap: 5,
    },
    input: {
        flex: 0,
        width: 'auto',
        backgroundColor: 'grey'
    },
    participantInfo: {
        // backgroundColor: 'red',
        // height: 40,
        // width: 40,
        justifyContent: 'center',
        gap: 5,
    }
})
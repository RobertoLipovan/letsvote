
import { Hoverable } from 'react-native-web-hover';
import { TextInput, StyleSheet } from "react-native";
import { Colors } from "../constants";

export default function Input({ placeholder, value, setValue }: { placeholder: string, value: string, setValue: (value: string) => void }) {
    return (
        <Hoverable style={{ width: '80%' }}>
            {({ hovered }) => (
                <TextInput 
                    style={[styles.roomInput, hovered && styles.roomInputHovered]} 
                    placeholder={placeholder}
                    placeholderTextColor={hovered ? Colors.input.hovered.placeholder : Colors.input.normal.placeholder}
                    cursorColor={hovered ? Colors.input.hovered.content : Colors.input.normal.content}
                    value={value}
                    onChangeText={setValue}
                    keyboardType="numeric"
                />
            )}
        </Hoverable>
    );
}

const styles = StyleSheet.create({
    roomInput: {
        flex: 1,
        height: '100%',
        padding: 10,
        borderRadius: 15,
        backgroundColor: Colors.input.normal.background,
        color: Colors.input.normal.content,
        fontSize: 24,
        fontWeight: '800',
    },
    roomInputHovered: {
        backgroundColor: Colors.input.hovered.background,
    },
});

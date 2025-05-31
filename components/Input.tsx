import { Hoverable } from 'react-native-web-hover';
import { TextInput, StyleSheet, Platform, View } from "react-native";
import { Colors } from "../constants";
import { useState, useRef, useEffect } from "react";

export default function Input({ 
    placeholder, 
    value, 
    setValue, 
    editable = true 
}: { 
    placeholder: string, 
    value?: string, 
    setValue: (value: string) => void,
    editable?: boolean 
}) {
    const [width, setWidth] = useState(50);
    const inputRef = useRef<any>(null);

    const updateWidth = (text: string) => {
        if (Platform.OS === 'web' && inputRef.current) {
            // @ts-ignore
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (context) {
                context.font = '800 24px system-ui';
                const textWidth = context.measureText(text || placeholder).width;
                const newWidth = Math.max(50, Math.min(200, textWidth + 25));
                setWidth(newWidth);
            }
        }
    };

    useEffect(() => {
        updateWidth(value || '');
    }, [value]);

    return (
        <Hoverable style={styles.hoverable}>
            {({ hovered }) => (
                <View style={styles.container}>
                    <TextInput 
                        ref={inputRef}
                        style={[
                            styles.input, 
                            hovered && styles.inputHovered,
                            Platform.OS === 'web' ? 
                                { width } : 
                                { flex: 0, minWidth: 50, maxWidth: 200 },
                            Platform.OS === 'web' && {
                                // @ts-ignore
                                outline: 'none',
                                outlineStyle: 'none',
                                outlineWidth: 0,
                                outlineColor: 'transparent',
                                boxShadow: 'none',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                            },
                            !editable && styles.inputDisabled
                        ]} 
                        placeholder={placeholder}
                        placeholderTextColor={hovered ? Colors.input.hovered.placeholder : Colors.input.normal.placeholder}
                        cursorColor={hovered ? Colors.input.hovered.content : Colors.input.normal.content}
                        value={value}
                        onChangeText={(text) => {
                            setValue(text);
                            updateWidth(text);
                        }}
                        keyboardType="numeric"
                        editable={editable}
                    />
                </View>
            )}
        </Hoverable>
    );
}

const styles = StyleSheet.create({
    hoverable: {
        display: 'flex',
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        padding: 10,
        backgroundColor: Colors.input.hovered.background,
        borderRadius: 15,
        color: Colors.input.normal.content,
        fontSize: 24,
        fontWeight: '800',
    },
    inputHovered: {
        backgroundColor: Colors.input.normal.background,
    },
    inputDisabled: {
        opacity: 0.5,
    },
});

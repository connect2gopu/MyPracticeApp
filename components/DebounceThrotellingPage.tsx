import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useDebounce } from '../hooks/use-debounce.js';
import { useThrottle } from '../hooks/use-throtelling.js';

const dtStyle = StyleSheet.create({
    input: {
        height: 40,
        borderColor: 'blue',
        borderRadius: 4,
        borderWidth: 1,
        paddingHorizontal: 10
    },
    container: {
        padding: 20
    },
    outputContainer: {

    },
    outputRow: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10
    }

})

export const DebounceThrotellingPage = () => {
    const [userInput, setUserInput] = useState("");
    const [outputDefualt, setOutputDefault] = useState("");
    const [outputDebounce, setOutputDebounce] = useState("");
    const [outputThrotelling, setOutputThrotelling] = useState("");

    const handleOnChangeText = (txt: string) => {
        setUserInput(txt)
    }

    const debouncedSetOutputDebounce = useDebounce((txt) => {
        setOutputDebounce(txt);
    }, 1000);

    const throtelledSetOutputThrotell = useThrottle((txt: string) => {
        setOutputThrotelling(txt);
    }, 1000, { leading: true, trailing: true });


    useEffect(() => {
        setOutputDefault(userInput);
        debouncedSetOutputDebounce(userInput);
        throtelledSetOutputThrotell(userInput);
    }, [userInput, debouncedSetOutputDebounce, throtelledSetOutputThrotell])

    return <>
        <Text>This is a debouncing and throtelling page</Text>

        <View style={dtStyle.container}>
            <TextInput
                value={userInput}
                onChangeText={handleOnChangeText}
                placeholder='input your query'
                placeholderTextColor="#999"
                style={dtStyle.input}
            />
            <View style={dtStyle.outputContainer}>
                <View style={dtStyle.outputRow}>
                    <Text>Default: </Text>
                    <Text>{outputDefualt}</Text>
                </View>
                <View style={dtStyle.outputRow}>
                    <Text>Debounce: </Text>
                    <Text>{outputDebounce}</Text>
                </View>
                <View style={dtStyle.outputRow}>
                    <Text>Throtelling: </Text>
                    <Text>{outputThrotelling}</Text>
                </View>
            </View>

        </View>
    </>
}


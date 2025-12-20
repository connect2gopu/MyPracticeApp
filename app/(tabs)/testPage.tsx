import React, { useEffect, useReducer, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
const DummyPage = () => {
    return <>
        <Text>This is a dummy test page</Text>
    </>
}

const DebounceThrotellingPage = () => {
    const [userInput, setUserInput] = useState("");
    const [outputDefualt, setOutputDefault] = useState("");
    const [outputDebounce, setOutputDebounce] = useState("");
    const [outputThrotelling, setOutputThrotelling] = useState("");

    const handleOnChangeText = txt => {
        setUserInput(txt)
    }

    useEffect(() => {
        setOutputDefault(userInput);
        // setOutputDebounce(userInput);
        // setOutputThrotelling(userInput);
    }, [userInput])

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
                    <Text>Default: </Text><Text id="output-default">{outputDefualt}</Text>
                </View>
                <View style={dtStyle.outputRow}>
                    <Text>Debounce: </Text><Text id="output-debounce">{outputDebounce}</Text>
                </View>
                <View style={dtStyle.outputRow}>
                    <Text>Throtelling: </Text><Text id="output-throtelling">{outputThrotelling}</Text>
                </View>
            </View>

        </View>
    </>
}

type CounterState = number;
type TodoState = string[]

type CounterAction = { type: "INC" }
    | { type: "RESET" }
    | { type: "DEC" };
type TodoAction = { type: "ADD_TODO", payload: string }

type AppAction = CounterAction | TodoAction;

type RootState = {
    count: CounterState,
    todo: TodoState
}

type Reducer<S, A> = (state: S | undefined, action: A) => S;
type ReducerMap = {
    [K in keyof RootState]: Reducer<RootState[K], AppAction>
}

function combineReducer(
    reducers: ReducerMap
): Reducer<RootState, AppAction> {
    const reducerKeys = Object.keys(reducers) as (keyof RootState)[];

    return function combination(state: RootState | undefined = {} as RootState, action: AppAction): RootState {
        const nextState = {} as RootState

        for (let i = 0; i < reducerKeys.length; i++) {

            const key = reducerKeys[i]
            const reducer = reducers[key] as Reducer<RootState[typeof key], AppAction>

            const prevStateForKey = state?.[key] as RootState[typeof key] | undefined
            const nextStateForKey = reducer(prevStateForKey, action)

                ; (nextState as Record<keyof RootState, CounterState | TodoState>)[key] = nextStateForKey
        }

        return nextState;
    }
}

function counterReducer(
    state: CounterState | undefined = 0,
    action: AppAction
): CounterState {
    switch (action.type) {
        case "INC":
            return (state ?? 0) + 1;
        case "RESET":
            return 0
        case "DEC":
            return (state ?? 0) - 1;
        default:
            return state ?? 0
    }
}

function todoReducer(
    state: TodoState | undefined = [],
    action: AppAction
): TodoState {
    switch (action.type) {
        case "ADD_TODO":
            return [...(state ?? []), action.payload]
        default:
            return state ?? [];
    }
}

const rootReducer = combineReducer({
    count: counterReducer,
    todo: todoReducer
});

const initialState: RootState = {
    count: 0,
    todo: []
}

const UseReducerPage = () => {

    const [state, dispatch] = useReducer(rootReducer, initialState);

    return <>
        <Text>This is a use reducer</Text>
        <Text>{`Count: ${state.count}`}</Text>

        <View style={{display: 'flex', flexDirection: 'row', gap: 30, justifyContent: 'space-evenly'}}>
            <Button title='Increase' onPress={() => dispatch({ type: 'INC'})}/>
            <Button title='Reset' onPress={() => dispatch({ type: 'RESET'})}/>
            <Button title='Decrese' onPress={() => dispatch({ type: 'DEC'})}/>
        </View>
    </>
}

type PageType = "DUMMY" | "USE_REDUCER" | "DEBOUNCE_THROTELLING";
interface PageContentProps {
    pageType: PageType
}

const PageContent = ({ pageType }: PageContentProps) => {
    return <View>
        {pageMapper[pageType] || <View><Text>hello</Text></View>}
    </View>
}

const pageMapper: Record<PageType, React.JSX.Element> = {
    DUMMY: <DummyPage />,
    USE_REDUCER: <UseReducerPage />,
    DEBOUNCE_THROTELLING: <DebounceThrotellingPage />,
}

const TestPage = (): React.JSX.Element => {
    return <SafeAreaView style={{ flex: 1, backgroundColor: "#4A90E2" }}>
        <View style={{ flex: 1, padding: 32, backgroundColor: "#c1eaf5" }}>
            {/* <PageContent pageType={"DUMMY"} /> */}
            {/* <PageContent pageType={"USE_REDUCER"} /> */}
            <PageContent pageType={"DEBOUNCE_THROTELLING"} />
        </View>
    </SafeAreaView>
}

export default TestPage;
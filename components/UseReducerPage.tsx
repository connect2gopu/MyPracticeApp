import React, { useReducer } from 'react';
import { Button, Text, View } from 'react-native';

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

export const UseReducerPage = () => {

    const [state, dispatch] = useReducer(rootReducer, initialState);

    return <>
        <Text>This is a use reducer</Text>
        <Text>{`Count: ${state.count}`}</Text>

        <View style={{ display: 'flex', flexDirection: 'row', gap: 30, justifyContent: 'space-evenly' }}>
            <Button title='Increase' onPress={() => dispatch({ type: 'INC' })} />
            <Button title='Reset' onPress={() => dispatch({ type: 'RESET' })} />
            <Button title='Decrese' onPress={() => dispatch({ type: 'DEC' })} />
        </View>
    </>
}


import React, { useState } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    description: {
        fontSize: 14,
        marginBottom: 20,
        color: '#666'
    },
    input: {
        height: 40,
        borderColor: 'blue',
        borderRadius: 4,
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10
    },
    section: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5
    },
    logContainer: {
        maxHeight: 200,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 4,
        marginTop: 10
    },
    logItem: {
        fontSize: 12,
        marginBottom: 3,
        fontFamily: 'monospace'
    },
    resultText: {
        fontSize: 16,
        marginTop: 5,
        fontWeight: '600'
    },
    warning: {
        color: 'red',
        fontWeight: 'bold'
    },
    success: {
        color: 'green'
    }
});

// Simulated API call that returns results after a random delay
const mockApiCall = async (searchTerm: string, requestId: number): Promise<{ data: string; requestId: number; delay: number }> => {
    // Random delay between 500ms to 3000ms to simulate varying network conditions
    const delay = Math.floor(Math.random() * 2500) + 500;
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: `Results for "${searchTerm}" (Request #${requestId})`,
                requestId,
                delay
            });
        }, delay);
    });
};

export const AbortControllerPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [requestCount, setRequestCount] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const abortControllerRef = React.useRef<AbortController | null>(null);
    
    const addLog = (message: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    // WITHOUT AbortController - This demonstrates the race condition problem
    const handleSearchWithoutAbort = async (text: string) => {
        setSearchTerm(text);
        
        if (text.length === 0) {
            setResult('');
            return;
        }

        const currentRequestId = requestCount + 1;
        setRequestCount(currentRequestId);
        setIsLoading(true);

        addLog(`🚀 Request #${currentRequestId} sent for: "${text}"`);

        try {
            const response = await mockApiCall(text, currentRequestId);
            
            addLog(`✅ Request #${response.requestId} completed after ${response.delay}ms`);
            
            // THIS IS THE PROBLEM: Even old requests will update the state
            // If a slower request completes after a faster one, it will overwrite the newer result
            setResult(response.data);
            setIsLoading(false);
        } catch (error) {
            addLog(`❌ Request #${currentRequestId} failed`);
            setIsLoading(false);
        }
    };

    const handleSearchWithAbort = async (text: string) => {

        if(abortControllerRef.current) {
            abortControllerRef.current.abort();
            addLog(`🛑 Previous request aborted`);
        }

        setSearchTerm(text);
        
        if (text.length === 0) {
            setResult('');
            return;
        }

        const currentRequestId = requestCount + 1;
        setRequestCount(currentRequestId);
        setIsLoading(true);

        const abortController = new AbortController()
        abortControllerRef.current = abortController;

        addLog(`🚀 Request #${currentRequestId} sent for: "${text}"`);

        try {
            const response = await mockApiCall(text, currentRequestId);
            if(!abortController.signal.aborted) {
                addLog(`✅ Request #${response.requestId} completed after ${response.delay}ms`);
            
                // THIS IS THE PROBLEM: Even old requests will update the state
                // If a slower request completes after a faster one, it will overwrite the newer result
                setResult(response.data);
                setIsLoading(false);
            } else {
                addLog(`🚫 Request #${response.requestId} was aborted (ignored)`);
            }
            
            
        } catch (error) {
            if(!abortController.signal.aborted) {
                addLog(`❌ Request #${currentRequestId} failed`);
                setIsLoading(false);
            }
        }
    };

    const clearLogs = () => {
        setLogs([]);
        setRequestCount(0);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>AbortController Demo</Text>
            <Text style={styles.description}>
                🚨 WITHOUT AbortController: Type quickly to see race conditions!
                {'\n'}Old requests can complete after new ones, showing stale data.
            </Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Search Input (NO Abort Controller)</Text>
                <TextInput
                    value={searchTerm}
                    onChangeText={handleSearchWithAbort} // {handleSearchWithoutAbort}
                    placeholder='Type quickly: "apple", "banana", "cherry"...'
                    placeholderTextColor="#999"
                    style={styles.input}
                />
                
                {isLoading && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        <ActivityIndicator size="small" color="#0000ff" />
                        <Text style={{ marginLeft: 10 }}>Loading...</Text>
                    </View>
                )}

                <View style={{ marginTop: 10 }}>
                    <Text style={styles.sectionTitle}>Current Result:</Text>
                    <Text style={[styles.resultText, styles.warning]}>
                        {result || 'No results yet'}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666', marginTop: 5 }}>
                        ⚠️ This might show stale data from an older request!
                    </Text>
                </View>
            </View>

            <View style={styles.section}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.sectionTitle}>Request Log:</Text>
                    <Button title="Clear Logs" onPress={clearLogs} />
                </View>
                <ScrollView style={styles.logContainer}>
                    {logs.length === 0 ? (
                        <Text style={{ color: '#999' }}>No requests yet. Start typing to see the race condition!</Text>
                    ) : (
                        logs.map((log, index) => (
                            <Text key={index} style={styles.logItem}>{log}</Text>
                        ))
                    )}
                </ScrollView>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🧪 How to Test:</Text>
                <Text style={{ fontSize: 14, lineHeight: 20 }}>
                    1. Type quickly: "a", then "ab", then "abc"{'\n'}
                    2. Watch the logs - requests complete in random order{'\n'}
                    3. Notice the result might show data from an old request{'\n'}
                    4. This is a RACE CONDITION!{'\n\n'}
                    💡 Later, you'll fix this with AbortController
                </Text>
            </View>
        </ScrollView>
    );
};


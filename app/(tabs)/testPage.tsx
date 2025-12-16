import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DummyPage = () => {
    return <>
        <Text>This is a dummy test page</Text>
    </>
}

type PageType = "DUMMY";
interface PageContentProps {
    pageType: PageType
}

const PageContent = ({ pageType }: PageContentProps) => {
    return <View>
        {pageMapper[pageType] || <View><Text>hello</Text></View>}
    </View>
}

const pageMapper: Record<PageType, React.JSX.Element> = {
    DUMMY: <DummyPage />
}

const TestPage = (): React.JSX.Element => {
    return <SafeAreaView style={{ flex: 1, backgroundColor: "#4A90E2" }}>
        <View style={{ flex: 1, padding: 32, backgroundColor: "#c1eaf5" }}>
            <PageContent pageType={"DUMMY"} />
            {/* <PageContent pageType={"USE_REDUCER"} /> */}
        </View>
    </SafeAreaView>
}

export default TestPage;
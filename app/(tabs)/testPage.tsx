import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AbortControllerPage } from '../../components/AbortControllerPage';
import { DebounceThrotellingPage } from '../../components/DebounceThrotellingPage';
import { DummyPage } from '../../components/DummyPage';
import { UseReducerPage } from '../../components/UseReducerPage';

type PageType = "DUMMY" | "USE_REDUCER" | "DEBOUNCE_THROTELLING" | "ABORT_CONTROLLER";
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
    ABORT_CONTROLLER: <AbortControllerPage />,
}

const TestPage = (): React.JSX.Element => {
    return <SafeAreaView style={{ flex: 1, backgroundColor: "#4A90E2" }}>
        <View style={{ flex: 1, padding: 32, backgroundColor: "#c1eaf5" }}>
            {/* <PageContent pageType={"DUMMY"} /> */}
            {/* <PageContent pageType={"USE_REDUCER"} /> */}
            {/* <PageContent pageType={"DEBOUNCE_THROTELLING"} /> */}
            <PageContent pageType={"ABORT_CONTROLLER"} />
        </View>
    </SafeAreaView>
}

export default TestPage;
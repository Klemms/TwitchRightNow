import {Loading} from '@/components/Loading';
import {ViewContext} from '@/entrypoints/popup/contexts/ViewContext.ts';
import {useResetScroll} from '@/entrypoints/popup/hooks/useResetScroll.ts';
import {ChannelDescription} from '@/entrypoints/popup/routes/VideosPlus/components/ChannelDescription';
import {FeaturedVideo} from '@/entrypoints/popup/routes/VideosPlus/components/FeaturedVideo';
import {Videos} from '@/entrypoints/popup/routes/VideosPlus/components/Videos';
import {Suspense, useContext, useEffect} from 'react';
import {useParams} from 'react-router';
import styles from './style.module.scss';

export function VideosPlus() {
    const {userId = ''} = useParams();

    useResetScroll();

    const {setNamePosition, setBackButton} = useContext(ViewContext);

    useEffect(() => {
        setNamePosition('right');
        setBackButton(true);
    }, [setBackButton, setNamePosition]);

    return (
        <div className={styles.videosPlus}>
            <div style={{marginBottom: '10rem'}}>
                <Suspense fallback={<Loading style={{margin: '50rem 0'}} />}>
                    <ChannelDescription userId={userId} />
                </Suspense>
            </div>
            <div style={{marginBottom: '10rem'}}>
                <Suspense fallback={<Loading style={{margin: '50rem 0'}} />}>
                    <FeaturedVideo userId={userId} />
                </Suspense>
            </div>
            <Suspense fallback={<Loading style={{margin: '50rem 0'}} />}>
                <Videos userId={userId} />
            </Suspense>
        </div>
    );
}

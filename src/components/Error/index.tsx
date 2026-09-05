import {Button} from '@/components/Button';
import {ChromeData} from '@/utils/ChromeData.ts';
import {QueryKeys} from '@/utils/QueryKeys.ts';
import {useQueryClient} from '@tanstack/react-query';
import styles from './style.module.scss';

export function ErrorComponent({lastError}: {lastError: string}) {
    const queryClient = useQueryClient();

    return (
        <div className={styles.lastError}>
            <div className={styles.title}>{browser.i18n.getMessage('error_title_refresh')}</div>
            <div className={styles.error}>{lastError}</div>
            <div className={styles.hint}>{browser.i18n.getMessage('error_report_hint')}</div>

            <div className={styles.buttons}>
                <Button
                    onClick={() => {
                        browser.tabs.create({
                            url: `https://github.com/Klemms/TwitchRightNow/issues`,
                        });
                    }}
                >
                    {browser.i18n.getMessage('error_button_report')}
                </Button>
                <Button
                    onClick={() => {
                        ChromeData.setError(false).finally(() => {
                            queryClient.resetQueries({queryKey: [QueryKeys.LAST_ERROR]});
                        });
                    }}
                >
                    {browser.i18n.getMessage('error_button_dismiss')}
                </Button>
            </div>
        </div>
    );
}

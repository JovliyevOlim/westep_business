import type {Preview} from '@storybook/react-vite'
import 'bootstrap/dist/css/bootstrap.min.css';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
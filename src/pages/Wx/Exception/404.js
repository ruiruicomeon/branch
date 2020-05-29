import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception404 = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('micromessenger') !== -1 && ua.indexOf('mobile') !== -1 ) {
        return (
            <Exception
                redirect="/wx/app"
                type="404"
                desc={formatMessage({ id: 'app.exception.description.404' })}
                linkElement={Link}
                backText={formatMessage({ id: 'app.exception.back' })}
            />
        );
    } else {
      return (
        <Exception
            type="404"
            desc={formatMessage({ id: 'app.exception.description.404' })}
            linkElement={Link}
            backText={formatMessage({ id: 'app.exception.back' })}
        />
    );
    }
 
};

export default Exception404;

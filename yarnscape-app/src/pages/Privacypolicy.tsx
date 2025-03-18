// For the Privacy policy screen
import {useNavigate} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

const Privacypolicy = () => {
    const navigate = useNavigate();
    const navigateToSettings = () => {
        navigate('/settings');
    }

    return (
        <div className="policy-container">
            <div className="policy-header">
                <div className="profile-icon" onClick={navigateToSettings}>
                    <FontAwesomeIcon icon={faArrowAltCircleLeft} size="2x" />
                </div>
                <h1>YarnScape's Privacy Policy</h1>
                <h2>Effective Date: 01/03/2025</h2>
            </div>

            <div className="policy-body">
                <p>
                    At YarnScape, we are committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, and disclose information when you use our mobile app ("YarnScape"). By accessing or using the YarnScape app, you consent to the data practices described in this policy.
                </p>
                <h3>1. Information We Collect</h3>
                <p>When you use YarnScape, we may collect the following:</p>
                <p>
                    [1.1] Personal Information: When you create an account, we collect information such as your name, email address, and password. We may also request additional personal information for user support purposes.</p>
                <p>
                    [1.2] User-Generated Content: As part of the app’s functionality, you can create and store knitting/crochet patterns, track projects, and manage your yarn and tool inventory. This data is stored in your account and is used to improve your experience.
                </p>
                <p>
                    [1.3] Device and Usage Information: We may collect information about your mobile device, operating system, IP address, device identifiers, browser type, and usage statistics (such as the features you use and the time spent within the app) for analytical purposes.
                </p>

                <h3>2. How We Use Your Information</h3>
                <p>
                    We use the information we collect to provide, personalize, and improve the YarnScape app and services. Specifically, we may use your information for:
                </p>
                <p>. Creating and managing your user account</p>
                <p>. Providing customer support and responding to inquiries</p>
                <p>. Storing and managing your knitting/crochet patterns, projects, yarn, and tool inventory</p>
                <p>. Analyzing usage trends to improve the app’s features and functionality</p>
                <p>. Sending you updates, newsletters, and promotional content, with your consent</p>

                <h3>3. Sharing Your Information</h3>
                <p>We do not share, sell, or rent your personal information to third parties, except in the following circumstances:</p>
                <p>[3.1] Service Providers: We may share your information with third-party service providers who assist in operating the app, such as hosting services, data storage, analytics services, and customer support.</p>
                <p>[3.2] Legal Compliance: We may disclose your information if required to do so by law or if we believe that such action is necessary to comply with legal obligations, protect our rights or safety, or respond to requests from public authorities.</p>

                <h3>4. Data Security</h3>
                <p>We take reasonable measures to protect your personal information from unauthorized access, alteration, or destruction. However, please note that no data transmission over the internet can be guaranteed to be completely secure, and we cannot ensure the security of information you transmit to us.</p>

                <h3>5. Your Choices</h3>
                <p>[5.1] Account Information: You can update or delete your account information at any time by logging into your account within the app or contacting customer support.</p>
                <p>[5.2] Push Notifications: You can manage push notification preferences through your device settings. If you no longer wish to receive notifications from YarnScape, you can disable them in your device’s notification settings.</p>

                <h3>6. Data Retention</h3>
                <p>We retain your personal information and user-generated content as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law. If you delete your account, we may retain some information for legal and administrative purposes, but we will not actively use your data for other purposes.</p>

                <h3>7. Changes To This Privacy Policy</h3>
                <p>We may update this Privacy Policy from time to time. When we do, we will post the updated policy within the app and update the effective date at the top of this page. We encourage you to review this policy periodically to stay informed about how we are protecting your information.</p>

                <h3>8. Contact Us</h3>
                <p>If you have any questions or concerns about this Privacy Policy or how we handle your personal information, please contact us at:</p>
                <p className="emailAdress">
                    enquiries@yarnscape.com
                </p>

                <p>By using YarnScape, you acknowledge that you have read and understand this Privacy Policy and agree to its terms.</p>

            </div>
        </div>
    )
}

export default Privacypolicy

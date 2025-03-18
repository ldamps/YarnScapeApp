// For the Terms and Conditions screen
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

const Termscon = () => {
    const navigate = useNavigate();
    
    /*const navigateToSettings = () => {
        navigate('/settings');
    }*/

    const handleGoBack = () => {
        navigate(-1);
    }

    return (
        <div className="termscons-container">
            <div className="termscons-header">
                <div className="profile-icon" onClick={handleGoBack}>
                    <FontAwesomeIcon icon={faArrowAltCircleLeft} size="2x" />
                </div>
                <h1>YarnScape's Terms and Conditions</h1>
                <h2>Effective Date: 01/03/2025</h2>
            </div>

            <div className="termscons-body">
                <p>Welcome to YarnScape! These Terms and Conditions ("Terms") govern your use of the YarnScape mobile application (the "App"), which allows users to create knitting/crochet patterns, track projects, find free patterns, and manage yarn and tool inventory. By downloading, accessing, or using YarnScape, you agree to be bound by these Terms and all applicable laws and regulations. If you do not agree to these Terms, please do not use the App.</p>

                <h3>1. Acceptance of Terms</h3>
                <p>By using YarnScape, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with these Terms, you must stop using the App immediately. We reserve the right to update or modify these Terms at any time without notice. The most recent version of these Terms will be posted in the App and on our website.</p>

                <h3>2. Use of YarnScape</h3>
                <p>[2.1] Eligibility: To use YarnScape, you must be at least 10 years of age. If you are under 10, you may not use the App.</p>
                <p>[2.2] Account Creation: To access features of the App, you are required to create an account. You agree to provide accurate, complete, and up-to-date information when creating an account. You are responsible for maintaining the confidentiality of your account information and for all activities under your account.</p>
                <p>[2.3] License: We grant you a limited, non-exclusive, non-transferable, and revocable license to use the App for personal, non-commercial purposes, subject to these Terms. You may not reverse engineer, decompile, or otherwise attempt to derive the source code of the App.</p>

                <h3>3. User-Generated Content</h3>
                <p>[3.1] Content Creation: YarnScape allows you to create and store knitting/crochet patterns, track projects, and manage your yarn and tool inventory ("User Content"). By submitting User Content to the App, you grant YarnScape a worldwide, royalty-free, sublicensable license to use, display, and distribute the content in connection with the operation and promotion of the App.</p>
                <p>[3.2] Prohibited Content: You agree not to upload or share content that:</p>
                <p>. Infringes on the intellectual property rights of others.</p>
                <p>. Is illegal, obscene, defamatory, abusive, or otherwise harmful</p>
                <p>. Violates any applicable laws or regulations</p>
                <p>. Contains viruses, malware, or other harmful code</p>

                <h3>4. Use of Features</h3>
                <p>[4.1] Knitting/Crochet Patterns: YarnScape offers tools to create and store patterns. You may also search for and follow free patterns shared by other users. You are responsible for ensuring that the patterns you create or download comply with any applicable copyright laws.</p>
                <p>[4.2] Inventory Management: You can manage your yarn and tool inventory within the App. You are solely responsible for ensuring the accuracy and completeness of the information in your inventory.</p>
                <p>[4.3] Project Tracking: YarnScape provides project tracking tools. You are responsible for maintaining your project information, and we are not liable for any discrepancies in your project tracking.</p>

                <h3>5. Third-Party Content and Links</h3>
                <p>YarnScape may contain links to third-party websites, resources, or services. We do not control or endorse these third-party sites or services and are not responsible for their content, accuracy, or availability. You acknowledge and agree that YarnScape is not liable for any damages or loss resulting from your use of third-party websites or services.</p>

                <h3>6. Data and Privacy</h3>
                <p>Your use of YarnScape is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal data. By using the App, you agree to the terms outlined in the Privacy Policy.</p>

                <h3>7. Limitations of Liability</h3>
                <p>[7.1] No Warranty: YarnScape is provided on an "as is" and "as available" basis. We do not warrant that the App will be uninterrupted, error-free, or free from viruses or other harmful components.</p>
                <p>[7.2] Limitation of Liability: To the maximum extent permitted by law, YarnScape shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your use of the App, including but not limited to damages for loss of profits, data, or use, even if YarnScape has been advised of the possibility of such damages.</p>

                <h3>8. Idemnification</h3>
                <p>You agree to indemnify, defend, and hold harmless YarnScape, its officers, directors, employees, agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or in connection with your use of the App, violation of these Terms, or infringement of any intellectual property or other rights of any third party.</p>

                <h3>9. Termination</h3>
                <p>We reserve the right to suspend or terminate your access to the App at our sole discretion, without notice, for any reason, including if you violate these Terms. Upon termination, your right to use the App will immediately cease, and you agree to stop using the App.</p>

                <h3>10. Governing Law</h3>
                <p>These Terms will be governed by and construed in accordance with the laws of The United Kingdom, without regard to its conflict of law principles. Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in The United Kingdom.</p>

                <h3>11. Dispute Resolution</h3>
                <p>If you have any concerns or disputes regarding the App, please contact us first at: </p>
                <p className="emailaddress">
                    enquiries@yarnscape.com
                </p>
                <p>We will attempt to resolve any disputes amicably through informal negotiations. If the dispute cannot be resolved informally, it shall be resolved through binding arbitration, in accordance with the rules of The United Kingdom.</p>

                <h3>12. Miscellaneous</h3>
                <p>[12.1] Entire Agreement: These Terms constitute the entire agreement between you and YarnScape regarding your use of the App and supersede all prior or contemporaneous communications, whether electronic, oral, or written, between you and YarnScape.</p>
                <p>[12.2] Severability: If any provision of these Terms is found to be unlawful, void, or unenforceable, that provision will be deemed severed from these Terms, and the remainder of the Terms will remain in full force and effect.</p>
                <p>Waiver: Failure to enforce any provision of these Terms shall not be deemed a waiver of that provision.</p>

                <h3>13. Contact Us</h3>
                <p>f you have any questions or concerns regarding these terms, please contact us at: </p>
                <p className="emailaddress">
                    enquiries@yarnscape.com
                </p>
                <p>By using YarnScape, you acknowledge that you have read and understood these Terms and Conditions and agree to be bound by them.</p>
            </div>
        </div>
    )
}

export default Termscon
import H2Header from "@/components/h2Heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Impressum() {
    return (
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 gap-2" >
            <Card>
                <CardHeader>
                    <CardTitle>
                        Impressum
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <H2Header>Angaben gemäß § 5 TMG</H2Header>
                    <div>
                        Enrico Kaack
                        <br />
                        Seegasse 59
                        <br />
                        D-69207 Sandhausen
                    </div>
                    <H2Header>Kontakt</H2Header>
                    <div>E-Mail: enricokaack@outlook.com</div>
                    <H2Header>Datenschutzerklärung</H2Header>
                    <b>Hosting</b><br />
                    Unser Hoster erhebt in sog. Logfiles folgende Daten, die Ihr Browser übermittelt:
                    <br /><br />
                    IP-Adresse, die Adresse der vorher besuchten Website (Referer Anfrage-Header), Datum und Uhrzeit der Anfrage, Zeitzonendifferenz zur Greenwich Mean Time, Inhalt der Anforderung, HTTP-Statuscode, übertragene Datenmenge, Website, von der die Anforderung kommt und Informationen zu Browser und Betriebssystem.
                    <br /><br />
                    Das ist erforderlich, um unsere Website anzuzeigen und die Stabilität und Sicherheit zu gewährleisten. Dies entspricht unserem berechtigten Interesse im Sinne des Art. 6 Abs. 1 S. 1 lit. f DSGVO.
                    <br /><br />
                    Es erfolgt kein Tracking und wir haben auf diese Daten keinen direkten Zugriff, sondern erhalten lediglich eine anonymisierte,  statistische Zusammenfassung. Diese beinhaltet die Adresse der vorher besuchten Seite, die Häufigkeit der jeweils aufgerufenen Seiten und die Anzahl eindeutiger Besucher. Diese Daten führen wir nicht mit anderen Daten zusammen.
                    <br /><br />
                    Wir setzen für die Zurverfügungstellung unserer Website folgenden Hoster ein:
                    <br /><br />
                    GitHub Inc.<br />
                    88 Colin P Kelly Jr St<br />
                    San Francisco, CA 94107<br />
                    United States
                    <br /><br />
                    Dieser ist Empfänger Ihrer personenbezogenen Daten. Dies entspricht unserem berechtigten Interesse im Sinne des Art. 6 Abs. 1 S. 1 lit. f DSGVO, selbst keinen Server in unseren Räumlichkeiten vorhalten zu müssen. Serverstandort ist USA.
                    <br /><br />
                    Weitere Informationen zu Widerspruchs- und Beseitigungsmöglichkeiten gegenüber GitHub finden Sie unter: https://docs.github.com/en/free-pro-team@latest/github/site-policy/github-privacy-statement#github-pages
                    <br /><br />
                    Sie haben das Recht der Verarbeitung zu widersprechen. Ob der Widerspruch erfolgreich ist, ist im Rahmen einer Interessenabwägung zu ermitteln.
                    <br /><br />
                    Die Daten werden gelöscht, sobald der Zweck der Verarbeitung entfällt.
                    <br /><br />
                    Die Verarbeitung der unter diesem Abschnitt angegebenen Daten ist weder gesetzlich noch vertraglich vorgeschrieben. Die Funktionsfähigkeit der Website ist ohne die Verarbeitung nicht gewährleistet.
                    <br /><br />
                    GitHub hat Compliance-Maßnahmen für internationale Datenübermittlungen umgesetzt. Diese gelten für alle weltweiten Aktivitäten, bei denen GitHub personenbezogene Daten von natürlichen Personen in der EU verarbeitet. Diese Maßnahmen basieren auf den EU-Standardvertragsklauseln (SCCs). Weitere Informationen finden Sie unter: https://docs.github.com/en/free-pro-team@latest/github/site-policy/github-data-protection-addendum#attachment-1--the-standard-contractual-clauses-processors
                </CardContent>
            </Card>
        </div>
    );
}
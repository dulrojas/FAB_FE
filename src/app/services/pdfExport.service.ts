import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export class PdfExportService {
  static generateCustomPdf(projectObj: any): void {
    const doc = new jsPDF({ orientation: 'portrait' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const maxTextWidth = pageWidth - (2 * margin);

    let verticalPadding = 10;
    let commondVerticalGap = 10;
    let horizontalPadding = 10;
    
    // ======= ======= ======= TITLE SECTION ======= ======= =======
    let title = "REPORTE DE PROYECTO: ";

    const titleWidth = doc.getTextWidth(title);
    const projectWidth = doc.getTextWidth(projectObj.proyecto);
    const totalWidth = titleWidth + projectWidth + 2;
    
    const x = (pageWidth - totalWidth) / 2;

    doc.setFont('helvetica', 'bold');
    doc.text(title, horizontalPadding, verticalPadding);

    const availableSpace = pageWidth - x - titleWidth - margin;
    const wrappedText = doc.splitTextToSize(projectObj.proyecto, availableSpace);
    doc.setFont('helvetica', 'normal');
    doc.text(wrappedText, horizontalPadding + titleWidth + 2, verticalPadding);
    verticalPadding += commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= NOMBRE COMPLETO SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text("Datos del proyecto", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;

    doc.setFontSize(12);
    doc.text("Nombre completo del proyecto", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;

    doc.setFont('helvetica', 'normal');
    doc.text(projectObj.descrpcion, horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= RESPONSABLES SECTION ======= ======= =======
    let tableHeader = [["Responsable de registro", "Unidad ejecutora"]];
    let personRespName = projectObj.nombres+" "+projectObj.apellido_1+((projectObj.apellido_2)?(" "+projectObj.apellido_2):(""));
    autoTable(doc, {
      startY: verticalPadding,
      head: tableHeader,
      body: [[personRespName, projectObj.inst_unidad]],
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= NOTAS ADICIONALES SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Notas adicionales", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;

    doc.setFont('helvetica', 'normal');
    doc.text(projectObj.notas, horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= OBJETIVOS TDC SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Objetivos de la TDC que contribuyen al proyecto", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;

    autoTable(doc, {
      startY: verticalPadding,
      body: projectObj.objetivos_tdc
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= OBJETIVOS ODS SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Objetivos ODS que contribuyen al proyecto", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;

    autoTable(doc, {
      startY: verticalPadding,
      body: projectObj.objetivos_ods
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= FECHAS SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Fechas", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;

    const data = [
      [
        { content: "Firma Convenio", styles: { fontStyle: "bold" } },
        { content: "Fin Planificado del proyecto", styles: { fontStyle: "bold" } },
        { content: "Fin Ampliado del proyecto", styles: { fontStyle: "bold" } }
      ],
      [projectObj.fecha_convenio, projectObj.fecha_fin, projectObj.fecha_fin_ampliada],
      [
        { content: "1er desembolso", styles: { fontStyle: "bold" } },
        { content: "Reporte indicadores", styles: { fontStyle: "bold" } },
        { content: "Tiempo avanzado", styles: { fontStyle: "bold" } }
      ],
      [projectObj.fecha_desembolso_1, projectObj.reporte, projectObj.elapsedTimeStr],
      [
        { content: "Inicio real de proyecto", styles: { fontStyle: "bold" } },
        { content: "Primer reporte", styles: { fontStyle: "bold" } },
        { content: "", styles: { fontStyle: "bold" } }
      ],
      [projectObj.fecha_inicio, projectObj.fecha_evaluacion_1, ""]
    ];
    
    autoTable(doc, {
      startY: verticalPadding,
      body: data
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= PRESUPUESTO SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text("Presupuesto", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(projectObj.presupuesto_mn, horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;
    
    doc.setFont('helvetica', 'bold');
    doc.text("Composición del Presupuesto", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;
    
    tableHeader = [["ID", "FINANCIADOR", "TIPO", "%", "MONTO BS"]];
    autoTable(doc, {
      startY: verticalPadding,
      head: tableHeader,
      body: projectObj.financiadores
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    
    doc.setFont('helvetica', 'bold');
    doc.text("Planificacion Operativa Anual", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;
    
    tableHeader = [["AÑO", "PRESUPUESTO ANUAL PLANIFICADO EN ACTIVIDADES", "PRESUPUESTO FUERA DE ACTIVIDADES", "TOTAL"]];
    autoTable(doc, {
      startY: verticalPadding,
      head: tableHeader,
      body: projectObj.presupuestos
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= COMP PRESUPUESTO SECTION ======= ======= =======
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= PLANIF OPERATIVA SECTION ======= ======= =======
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= ALCANCE GEO SECTION ======= ======= =======
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= OBLIGACIONES SECTION ======= ======= =======
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= PLANIF ESTRATEGICA SECTION ======= ======= =======
    doc.addPage('a4', 'landscape'); 
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= EJEC ESTRATEGICA SECTION ======= ======= =======
    doc.addPage('a4', 'landscape'); 
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= EJEC FINANCIERA SECTION ======= ======= =======
    doc.addPage('a4', 'landscape'); 
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= ADICIONALES SECTION ======= ======= =======
    doc.addPage('a4', 'landscape'); 
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= ACTIVIDADES PROY SECTION ======= ======= =======
    doc.addPage('a4', 'landscape'); 
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= LOGROS SECTION ======= ======= =======
    doc.addPage('a4', 'landscape'); 
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= EVENTOS BENEF SECTION ======= ======= =======
    doc.addPage('a4', 'landscape'); 
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= ALIANZAS SECTION ======= ======= =======
    doc.addPage('a4', 'landscape'); 
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= RIESGOS SECTION ======= ======= =======
    doc.addPage('a4', 'landscape'); 
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= APRENDIZAJES SECTION ======= ======= =======
    doc.addPage('a4', 'landscape'); 
    // ======= ======= ======= ======= ======= ======= =======

    doc.save(`${"test"}.pdf`);
  }
}

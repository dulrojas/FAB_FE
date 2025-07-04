import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export class PdfExportService {
  static generateCustomPdf(projectObj: any): void {
    const doc = new jsPDF({ orientation: 'portrait' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;

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
      headStyles: {
        fillColor: [78, 134, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      head: tableHeader,
      body: [[personRespName, projectObj.inst_unidad]]
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= NOTAS ADICIONALES SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Notas adicionales", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;

    doc.setFont('helvetica', 'normal');
    doc.text((projectObj.notas)?(projectObj.notas):(""), horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= OBJETIVOS TDC SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Objetivos de la TDC que contribuyen al proyecto", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;

    autoTable(doc, {
      startY: verticalPadding,
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
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
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
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
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      body: data
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= COMP PRESUPUESTO SECTION ======= ======= =======
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
      headStyles: {
        fillColor: [78, 134, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      head: tableHeader,
      body: projectObj.financiadores
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= PLANIF OPERATIVA SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Planificación Operativa Anual", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;
    
    tableHeader = [["AÑO", "PRESUPUESTO DE LA GESTIÓN"]];
    autoTable(doc, {
      startY: verticalPadding,
      headStyles: {
        fillColor: [78, 134, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      head: tableHeader,
      body: projectObj.presupuestos
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= ALCANCE GEO SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Alcance Geografico", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;
    
    tableHeader = [["TIPO", "LUGAR"]];
    autoTable(doc, {
      startY: verticalPadding,
      headStyles: {
        fillColor: [78, 134, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      head: tableHeader,
      body: projectObj.ubicaciones
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    
    tableHeader = [["TIPO", "LUGAR"]];
    autoTable(doc, {
      startY: verticalPadding,
      headStyles: {
        fillColor: [78, 134, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      head: tableHeader,
      body: projectObj.ubicacionesBranch
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= OBLIGACIONES SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Obligaciones", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;
    
    tableHeader = [["ID", "COMPROMISO", "REQUISITOS Y/O DOCUMENTOS", "FECHA OBLIGACION", "ESTADO ENTREGA"]];
    autoTable(doc, {
      startY: verticalPadding,
      headStyles: {
        fillColor: [78, 134, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      head: tableHeader,
      body: projectObj.obligaciones
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= PLANIF ESTRATEGICA SECTION ======= ======= =======
    doc.addPage('a4', 'landscape'); 
    verticalPadding = commondVerticalGap;

    doc.setFont('helvetica', 'bold');
    doc.text("Planificación Estratégica", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;
    
    tableHeader = [["TIPO", "CÓDIGO", "NOMBRE", "LÍNEA BASE", "MEDIDA", "META", "MEDIO DE VERIFICACIÓN"]];
    autoTable(doc, {
      startY: verticalPadding,
      headStyles: {
        fillColor: [78, 134, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      head: tableHeader,
      body: projectObj.planEstrategica
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= EJEC ESTRATEGICA SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Ejecución Estratégica", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;
    
    autoTable(doc, {
      startY: verticalPadding,
      headStyles: {
        fillColor: [78, 134, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      head: [
        [
          { content: '', colSpan: 1, styles: { halign: 'center', fillColor: [200, 200, 200] } },
          { content: '', colSpan: 1, styles: { halign: 'center', fillColor: [200, 200, 200] } },
          { content: 'PERIODO ACTUAL', colSpan: 4, styles: { halign: 'center', fillColor: [200, 200, 200] } },
          { content: '', colSpan: 1, styles: { halign: 'center', fillColor: [200, 200, 200] } },
          { content: 'META', colSpan: 2, styles: { halign: 'center', fillColor: [200, 200, 200] } }
        ],
        ['COD', 'NOMBRE', 'REPORTE A', 'PROGRESO', 'MEDIDA', 'METAPER', 'AVANCE PER.', 'META FINAL', 'AVANCE']
      ],
      body: projectObj.ejecEstrategica
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= EJEC FINANCIERA SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Ejecución Financiera", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;
    
    tableHeader = [["PRESUPUESTO DEL PROYECTO", "EJECUTADO", "PRESUPUESTO DE LA GESTIÓN "+projectObj.gestion, "EJECUTADO "+projectObj.gestion]];
    autoTable(doc, {
      startY: verticalPadding,
      headStyles: {
        fillColor: [78, 134, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      head: tableHeader,
      body: [[ projectObj.pro_act_presupuesto, projectObj.pro_act_ejecutado, projectObj.pro_act_presupuesto_gestion, projectObj.pro_act_ejecutado ]]
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= ADICIONALES SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Adicionales", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;
    
    tableHeader = [["FECHA", "MONTO", "MOTIVO"]];
    autoTable(doc, {
      startY: verticalPadding,
      headStyles: {
        fillColor: [78, 134, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      head: tableHeader,
      body: projectObj.preAvance
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= ACTIVIDADES PROY SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Actividades del Proyecto", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;
    
    tableHeader = [["RES", "ACTIVIDADES", "PRESUPUESTO", "AVANCE", "EJECUTADO", "FECHA INICIO", "FECHA FIN"]];
    autoTable(doc, {
      startY: verticalPadding,
      headStyles: {
        fillColor: [78, 134, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      head: tableHeader,
      body: projectObj.actividades
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= LOGROS SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Logros", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap; 
    
    tableHeader = [["FECHA", "TIPO", "LOGRO"]];
    autoTable(doc, {
      startY: verticalPadding,
      headStyles: {
        fillColor: [78, 134, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      head: tableHeader,
      body: projectObj.logros
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= EVENTOS BENEF SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Eventos para Beneficiarios", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;
    
    tableHeader = [["ID", "FECHA", "TIPO ACTOR", "INSTITUCIÓN /COMUNIDAD", "EVENTO", "MUJERES", "HOMBRES", "TOTAL"]];
    autoTable(doc, {
      startY: verticalPadding,
      headStyles: {
        fillColor: [78, 134, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      head: tableHeader,
      body: projectObj.beneficiarios
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= ALIANZAS SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Alianzas conseguidas", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap;
    
    tableHeader = [["ID", "FECHA", "ORGANIZACION", "NOMBRE DEL REFERENTE", "VÍNCULO CON LOS RESULTADOS", "CONVENIO"]];
    autoTable(doc, {
      startY: verticalPadding,
      headStyles: {
        fillColor: [78, 134, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      head: tableHeader,
      body: projectObj.aliados
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= RIESGOS SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Gestión de Riesgos", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap; 
    
    tableHeader = [["ID", "CATEGORÍA", "IDENTIFICACIÓN", "RIESGO/SUPUESTO/HIPÓTESIS", "IMPACTO", "PROBABILIDAD", "NIVEL DE RIESGO", "TOMAR MEDIDAS"]];
    autoTable(doc, {
      startY: verticalPadding,
      headStyles: {
        fillColor: [78, 134, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      head: tableHeader,
      body: projectObj.riesgos
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======
    // ======= ======= ======= APRENDIZAJES SECTION ======= ======= =======
    doc.setFont('helvetica', 'bold');
    doc.text("Aprendizajes", horizontalPadding, verticalPadding);
    verticalPadding += commondVerticalGap; 
    
    tableHeader = [["ID", "FECHA APRENDIZAJE", "AREA DE APRENDIZAJE", "TIPO", "APRENDIZAJE"]];
    autoTable(doc, {
      startY: verticalPadding,
      headStyles: {
        fillColor: [78, 134, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      head: tableHeader,
      body: projectObj.aprendizajes
    });
    verticalPadding = (doc as any).lastAutoTable.finalY + commondVerticalGap;
    // ======= ======= ======= ======= ======= ======= =======

    const currentDate = new Date().toISOString().slice(0, 10);
    doc.save(projectObj.proyecto+"_"+currentDate+'.pdf');
  }
}
